import { useState, useMemo } from "react";

export function useBillSplitter() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [participantName, setParticipantName] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [meatAmount, setMeatAmount] = useState("");
  const [generalAmount, setGeneralAmount] = useState("");
  const [showSettlement, setShowSettlement] = useState(false);
  const [roundAmounts, setRoundAmounts] = useState(true);

  // Add participant (and optionally their expense)
  const addParticipant = () => {
    if (!participantName.trim()) return;

    const newParticipant = {
      id: Date.now(),
      name: participantName.trim(),
      isVegetarian,
    };

    setParticipants([...participants, newParticipant]);

    // If they entered an expense amount, add it too
    if (totalAmount && parseFloat(totalAmount) > 0) {
      const total = parseFloat(totalAmount);
      const meat = parseFloat(meatAmount) || 0;
      const general = parseFloat(generalAmount) || 0;

      if (meat + general === total) {
        const newExpense = {
          id: Date.now(),
          payerId: newParticipant.id,
          payerName: newParticipant.name,
          totalAmount: total,
          meatAmount: meat,
          generalAmount: general,
        };
        setExpenses([...expenses, newExpense]);
      }
    }

    // Reset form
    setParticipantName("");
    setIsVegetarian(false);
    setTotalAmount("");
    setMeatAmount("");
    setGeneralAmount("");
    setShowSettlement(false);
  };

  // Remove participant
  const removeParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
    setExpenses(expenses.filter((e) => e.payerId !== id));
  };

  // Reset all data
  const resetAll = () => {
    setParticipants([]);
    setExpenses([]);
    setShowSettlement(false);
  };

  // Update amounts when total changes
  const handleTotalAmountChange = (value) => {
    setTotalAmount(value);
    const numValue = parseFloat(value) || 0;
    if (meatAmount === "" || meatAmount === "0") {
      setGeneralAmount(numValue.toString());
    } else {
      const meat = parseFloat(meatAmount) || 0;
      setGeneralAmount((numValue - meat).toString());
    }
  };

  // Update general amount when meat amount changes
  const handleMeatAmountChange = (value) => {
    const total = parseFloat(totalAmount) || 0;
    const meat = parseFloat(value) || 0;

    if (meat < 0) {
      setMeatAmount("0");
      setGeneralAmount(total.toString());
      return;
    }

    if (meat > total) {
      setMeatAmount(total.toString());
      setGeneralAmount("0");
      return;
    }

    setMeatAmount(value);
    setGeneralAmount((total - meat).toString());
  };

  // Update meat amount when general amount changes
  const handleGeneralAmountChange = (value) => {
    const total = parseFloat(totalAmount) || 0;
    const general = parseFloat(value) || 0;

    if (general < 0) {
      setGeneralAmount("0");
      setMeatAmount(total.toString());
      return;
    }

    if (general > total) {
      setGeneralAmount(total.toString());
      setMeatAmount("0");
      return;
    }

    setGeneralAmount(value);
    setMeatAmount((total - general).toString());
  };

  // Calculate settlement
  const settlement = useMemo(() => {
    if (participants.length === 0 || expenses.length === 0) return null;

    const totalGeneral = expenses.reduce((sum, e) => sum + e.generalAmount, 0);
    const totalMeat = expenses.reduce((sum, e) => sum + e.meatAmount, 0);

    const totalParticipants = participants.length;
    const nonVegParticipants = participants.filter(
      (p) => !p.isVegetarian,
    ).length;

    if (nonVegParticipants === 0 && totalMeat > 0) {
      return { error: "No non-vegetarian participants to split meat costs" };
    }

    const generalPerPerson = totalGeneral / totalParticipants;
    const meatPerPerson =
      nonVegParticipants > 0 ? totalMeat / nonVegParticipants : 0;

    const balances = {};
    participants.forEach((p) => {
      const share = p.isVegetarian
        ? generalPerPerson
        : generalPerPerson + meatPerPerson;
      const paid = expenses
        .filter((e) => e.payerId === p.id)
        .reduce((sum, e) => sum + e.totalAmount, 0);
      balances[p.id] = {
        name: p.name,
        share,
        paid,
        balance: paid - share,
      };
    });

    const transactions = [];
    const debtors = Object.values(balances)
      .filter((b) => b.balance < -0.01)
      .map((b) => ({ ...b }));
    const creditors = Object.values(balances)
      .filter((b) => b.balance > 0.01)
      .map((b) => ({ ...b }));

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) debtors.shift();
      if (Math.abs(creditor.balance) < 0.01) creditors.shift();
    }

    return {
      totalGeneral,
      totalMeat,
      generalPerPerson,
      meatPerPerson,
      balances,
      transactions,
    };
  }, [participants, expenses]);

  return {
    participants,
    expenses,
    participantName,
    setParticipantName,
    isVegetarian,
    setIsVegetarian,
    totalAmount,
    setTotalAmount,
    meatAmount,
    setMeatAmount,
    generalAmount,
    setGeneralAmount,
    showSettlement,
    setShowSettlement,
    roundAmounts,
    setRoundAmounts,
    addParticipant,
    removeParticipant,
    resetAll,
    handleTotalAmountChange,
    handleMeatAmountChange,
    handleGeneralAmountChange,
    settlement,
  };
}
