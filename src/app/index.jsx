import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shield, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { useBillSplitter } from "@/utils/useBillSplitter";
import { shareSettlement } from "@/utils/shareSettlement";
import { ParticipantForm } from "@/components/BillSplitter/ParticipantForm";
import { ParticipantsList } from "@/components/BillSplitter/ParticipantsList";
import { SettlementReport } from "@/components/BillSplitter/SettlementReport";
import { useLanguage } from "@/utils/useLanguage";
import { t } from "@/utils/translations";

export default function BillSplitter() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, currency, loadLanguage, isLoaded } = useLanguage();

  useEffect(() => {
    loadLanguage();
  }, []);

  const {
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
  } = useBillSplitter();

  const handleShare = () => {
    shareSettlement(settlement, roundAmounts, language, currency);
  };

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#667eea" }} />;
  }

  const isRTL = language === "he";

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 16 }}>
            {/* Header */}
            <View
              style={{
                marginBottom: 24,
                marginTop: 48,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 24,
                paddingVertical: 20,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#667eea",
                  textAlign: "center",
                }}
              >
                💰 EvenBetter 💰
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {t("subtitle", language)}
              </Text>
            </View>

            {/* Participant & Expense Entry */}
            <ParticipantForm
              participantName={participantName}
              setParticipantName={setParticipantName}
              isVegetarian={isVegetarian}
              setIsVegetarian={setIsVegetarian}
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              meatAmount={meatAmount}
              setMeatAmount={setMeatAmount}
              generalAmount={generalAmount}
              setGeneralAmount={setGeneralAmount}
              onAddParticipant={addParticipant}
              handleTotalAmountChange={handleTotalAmountChange}
              handleMeatAmountChange={handleMeatAmountChange}
              handleGeneralAmountChange={handleGeneralAmountChange}
              language={language}
            />

            {/* Participants List */}
            <ParticipantsList
              participants={participants}
              expenses={expenses}
              onRemoveParticipant={removeParticipant}
              onResetAll={resetAll}
              onCalculate={() => setShowSettlement(true)}
              language={language}
            />

            {/* Settlement Report */}
            {showSettlement && (
              <SettlementReport
                settlement={settlement}
                roundAmounts={roundAmounts}
                setRoundAmounts={setRoundAmounts}
                onShare={handleShare}
                language={language}
              />
            )}

            {/* Settings & Privacy Links */}
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                paddingVertical: 16,
                marginTop: 16,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Settings size={16} color="#667eea" />
                <Text
                  style={{ fontSize: 14, color: "#667eea", fontWeight: "600" }}
                >
                  {t("settings", language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/privacy")}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Shield size={16} color="#667eea" />
                <Text
                  style={{ fontSize: 14, color: "#667eea", fontWeight: "600" }}
                >
                  {t("privacyPolicy", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
