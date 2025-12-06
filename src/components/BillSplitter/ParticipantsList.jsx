import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { X, Calculator, RotateCcw } from "lucide-react-native";
import { useState, useEffect } from "react";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { t, getCurrencySymbol } from "@/utils/translations";
import { useLanguage } from "@/utils/useLanguage";

export function ParticipantsList({
  participants,
  expenses,
  onRemoveParticipant,
  onResetAll,
  onCalculate,
  language = "he",
}) {
  const [showResetModal, setShowResetModal] = useState(false);
  const calculateButtonScale = useSharedValue(1);
  const isRTL = language === "he";
  const { currency } = useLanguage();
  const currencySymbol = getCurrencySymbol(currency);

  // Cash register sound effect - classic cha-ching sound
  const cashRegisterSound = useAudioPlayer(
    require("../../../assets/sounds/Calculate.mp3")
  );

  // Initialize audio with proper mode settings
  useEffect(() => {
    const initAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          staysActiveInBackground: false,
        });
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };
    initAudio();
  }, []);

  const animatedCalculateButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: calculateButtonScale.value }],
  }));

  const handleCalculatePressIn = () => {
    calculateButtonScale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 400,
    });
  };

  const handleCalculatePressOut = () => {
    calculateButtonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const handleCalculatePress = async () => {
    try {
      // Make sure we start from the beginning
      cashRegisterSound.seekTo(0);
      // Play the sound
      cashRegisterSound.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }

    // Call the original calculate function
    onCalculate();
  };

  const handleResetPress = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setShowResetModal(false);
    onResetAll();
  };

  const handleCancelReset = () => {
    setShowResetModal(false);
  };

  if (participants.length === 0) {
    return (
      <View
        style={{
          paddingVertical: 48,
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 20,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#764ba2",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          👆 {t("startAdding", language)}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#764ba2",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      {/* Reset Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showResetModal}
        animationType="fade"
        onRequestClose={handleCancelReset}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          onPress={handleCancelReset}
        >
          <Pressable
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 340,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#DC2626",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {t("resetConfirmTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#374151",
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 24,
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("resetConfirmMessage", language)}
            </Text>
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={handleCancelReset}
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {t("cancel", language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmReset}
                style={{
                  backgroundColor: "#DC2626",
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  alignItems: "center",
                  shadowColor: "#DC2626",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  {t("confirmDelete", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#764ba2",
          }}
        >
          👥 {t("participantsList", language)} ({participants.length})
        </Text>
        <TouchableOpacity
          onPress={handleResetPress}
          style={{
            backgroundColor: "#FEE2E2",
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RotateCcw size={16} color="#DC2626" />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#DC2626",
            }}
          >
            {t("reset", language)}
          </Text>
        </TouchableOpacity>
      </View>

      {participants.map((p, index) => {
        const participantExpense = expenses.find((e) => e.payerId === p.id);
        const colorSet = { bg: "#EEF2FF", border: "#C7D2FE", text: "#4338CA" };

        return (
          <Animated.View
            key={p.id}
            entering={FadeInRight.springify()
              .damping(15)
              .stiffness(100)
              .delay(index * 50)}
            exiting={FadeOutLeft.duration(200)}
            style={{
              backgroundColor: colorSet.bg,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              borderWidth: 2,
              borderColor: colorSet.border,
              shadowColor: colorSet.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colorSet.text,
                  writingDirection: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {p.name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  fontWeight: "500",
                  marginTop: 2,
                  writingDirection: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {p.isVegetarian ? "🌱" : "🍖"}
                {participantExpense && (
                  <>
                    {" • "}
                    {participantExpense.generalAmount > 0 && (
                      <>
                        {t("general", language)}: {currencySymbol}
                        {participantExpense.generalAmount.toFixed(2)}
                      </>
                    )}
                    {participantExpense.generalAmount > 0 &&
                      participantExpense.meatAmount > 0 &&
                      " • "}
                    {participantExpense.meatAmount > 0 && (
                      <>
                        {t("meat", language)}: {currencySymbol}
                        {participantExpense.meatAmount.toFixed(2)}
                      </>
                    )}
                  </>
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onRemoveParticipant(p.id)}
              style={{
                padding: 6,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 8,
              }}
            >
              <X size={18} color="#F04438" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {expenses.length > 0 && (
        <Animated.View style={animatedCalculateButtonStyle}>
          <TouchableOpacity
            onPress={handleCalculatePress}
            onPressIn={handleCalculatePressIn}
            onPressOut={handleCalculatePressOut}
            activeOpacity={0.9}
            style={{
              backgroundColor: "#10B981",
              borderRadius: 14,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 8,
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {t("calculate", language)}
            </Text>
            <Calculator size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
