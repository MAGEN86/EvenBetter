import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { UserPlus } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { t, getCurrencySymbol } from "@/utils/translations";
import { useLanguage } from "@/utils/useLanguage";

export function ParticipantForm({
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
  onAddParticipant,
  handleTotalAmountChange,
  handleMeatAmountChange,
  handleGeneralAmountChange,
  language = "he",
}) {
  const buttonScale = useSharedValue(1);
  const isRTL = language === "he";
  const { currency } = useLanguage();
  const currencySymbol = getCurrencySymbol(currency);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#667eea",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#667eea",
            marginBottom: 16,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          🎯 {t("addExpense", language)}
        </Text>

        {/* Participant Info */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#E0E7FF",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#764ba2",
              marginBottom: 12,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            👤 {t("addParticipant", language)}
          </Text>

          <TextInput
            placeholder={t("participantName", language) + "..."}
            value={participantName}
            onChangeText={setParticipantName}
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 2,
              borderColor: "#C7D2FE",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: "#0F172A",
              textAlign: isRTL ? "right" : "left",
              marginBottom: 12,
            }}
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            onPress={() => setIsVegetarian(!isVegetarian)}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 12,
              borderWidth: 2,
              borderColor: isVegetarian ? "#10B981" : "#E0E7FF",
            }}
          >
            <Text style={{ fontSize: 14, color: "#764ba2", fontWeight: "600" }}>
              🌱 {t("isVegetarian", language)}?
            </Text>
            <View
              style={{
                width: 56,
                height: 32,
                borderRadius: 16,
                backgroundColor: isVegetarian ? "#10B981" : "#D1D5DB",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#FFFFFF",
                  alignSelf: isVegetarian ? "flex-end" : "flex-start",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Expense Info */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#E0E7FF",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#764ba2",
              marginBottom: 12,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            💳 {t("addExpense", language)}
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 13,
                color: "#667eea",
                marginBottom: 6,
                textAlign: isRTL ? "right" : "left",
                fontWeight: "600",
              }}
            >
              💰{" "}
              {language === "he"
                ? `סכום כולל (${currencySymbol})`
                : `Total Amount (${currencySymbol})`}
            </Text>
            <TextInput
              placeholder="0.00"
              value={totalAmount}
              onChangeText={handleTotalAmountChange}
              keyboardType="decimal-pad"
              editable={participantName.trim().length > 0}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              style={{
                backgroundColor: "#EEF2FF",
                borderWidth: 2,
                borderColor: "#C7D2FE",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 16,
                color: "#0F172A",
                textAlign: isRTL ? "right" : "left",
                opacity: participantName.trim().length > 0 ? 1 : 0.5,
                fontWeight: "600",
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View
            style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#DC2626",
                  marginBottom: 6,
                  textAlign: isRTL ? "right" : "left",
                  fontWeight: "600",
                }}
              >
                💵 {t("general", language)}
              </Text>
              <TextInput
                placeholder="0.00"
                value={generalAmount}
                onChangeText={handleGeneralAmountChange}
                keyboardType="decimal-pad"
                editable={!!(totalAmount && parseFloat(totalAmount) > 0)}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                style={{
                  backgroundColor: "#FEF3F2",
                  borderWidth: 2,
                  borderColor: "#FED7D7",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: "#0F172A",
                  textAlign: isRTL ? "right" : "left",
                  opacity: totalAmount && parseFloat(totalAmount) > 0 ? 1 : 0.5,
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#EA580C",
                  marginBottom: 6,
                  textAlign: isRTL ? "right" : "left",
                  fontWeight: "600",
                }}
              >
                🥩 {t("meat", language)}
              </Text>
              <TextInput
                placeholder="0.00"
                value={meatAmount}
                onChangeText={handleMeatAmountChange}
                keyboardType="decimal-pad"
                editable={!!(totalAmount && parseFloat(totalAmount) > 0)}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                style={{
                  backgroundColor: "#FFF4ED",
                  borderWidth: 2,
                  borderColor: "#FED7AA",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: "#0F172A",
                  textAlign: isRTL ? "right" : "left",
                  opacity: totalAmount && parseFloat(totalAmount) > 0 ? 1 : 0.5,
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={onAddParticipant}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!participantName.trim()}
            activeOpacity={0.9}
            style={{
              backgroundColor: participantName.trim() ? "#667eea" : "#E5E7EB",
              borderRadius: 14,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              shadowColor: participantName.trim() ? "#667eea" : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: participantName.trim() ? 6 : 0,
            }}
          >
            <Text
              style={{
                color: participantName.trim() ? "#FFFFFF" : "#6B7280",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {t("addParticipant", language)}
            </Text>
            <UserPlus
              size={20}
              color={participantName.trim() ? "#FFFFFF" : "#6B7280"}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
