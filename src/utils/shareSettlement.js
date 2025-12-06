import { Alert, Share } from "react-native";
import { t, getCurrencySymbol } from "./translations";

export async function shareSettlement(
  settlement,
  roundAmounts,
  language = "he",
  currency = "ILS",
) {
  if (!settlement || !settlement.transactions) {
    Alert.alert(
      language === "he" ? "שגיאה" : "Error",
      language === "he" ? "אין נתונים לשיתוף" : "No data to share",
    );
    return;
  }

  const currencySymbol = getCurrencySymbol(currency);

  try {
    // Build the message text
    let message = `📊 ${t("shareMessage", language)}\n`;
    message += "━━━━━━━━━━━━━━━━━━━━\n\n";

    // Summary
    message += `💰 ${t("generalExpenses", language)}: ${currencySymbol}${settlement.totalGeneral.toFixed(2)}\n`;
    message += `🥩 ${t("meatExpenses", language)}: ${currencySymbol}${settlement.totalMeat.toFixed(2)}\n\n`;

    message += `💸 ${language === "he" ? "תשלומים להעברה" : "Payments to Transfer"}:\n`;
    message += "━━━━━━━━━━━━━━━━━━━━\n";

    // Transactions - using ← arrow for RTL Hebrew, → for LTR English
    const arrow = language === "he" ? "←" : "→";
    settlement.transactions.forEach((t, i) => {
      const amount = roundAmounts ? Math.round(t.amount) : t.amount.toFixed(2);
      message += `${i + 1}. ${t.from} ${arrow} ${t.to}\n`;
      message += `   ${currencySymbol}${amount}\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━━━\n";
    message +=
      language === "he"
        ? "נוצר עם EvenBetter 🦊"
        : "Created with EvenBetter 🦊";

    // Share the text
    const result = await Share.share({
      message: message,
    });

    if (result.action === Share.sharedAction) {
      console.log("✅ Shared successfully");
    } else if (result.action === Share.dismissedAction) {
      console.log("❌ Share dismissed");
    }
  } catch (error) {
    console.error("❌ Error in shareSettlement:", error);
    Alert.alert(
      language === "he" ? "שגיאה" : "Error",
      language === "he"
        ? `לא ניתן לשתף. נסה שוב.\n\nפרטי שגיאה: ${error.message}`
        : `Cannot share. Try again.\n\nError details: ${error.message}`,
    );
  }
}
