import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { UserPlus } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInUp,
  FadeOutUp,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { t, getCurrencySymbol } from "@/utils/translations";
import { useLanguage } from "@/utils/useLanguage";
import { useEffect, useMemo, useRef, useState } from "react";

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
  eventName,
  setEventName,
  participants = [],
  language = "he",
}) {
  const buttonScale = useSharedValue(1);
  const headerScale = useSharedValue(1);

  const isRTL = language === "he";
  const { currency } = useLanguage();
  const currencySymbol = getCurrencySymbol(currency);

  const safeEventName = useMemo(() => (eventName ?? "").toString(), [eventName]);
  const hasEventName = safeEventName.trim().length > 0;

  // ✅ נרמול שם: מוריד רווחים מיותרים ומקטין אותיות
  const normalizeName = (name) =>
    (name ?? "")
      .toString()
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  // השם שהמשתמש הקליד, אחרי נרמול
  const normalizedInputName = normalizeName(participantName);

  // בדיקה אם כבר יש משתתף עם אותו שם
  const isDuplicateParticipantName = useMemo(() => {
    if (!normalizedInputName) return false;
    return participants.some((p) => normalizeName(p?.name) === normalizedInputName);
  }, [participants, normalizedInputName]);

  // האם מותר להוסיף
  const canAdd = participantName.trim().length > 0 && !isDuplicateParticipantName;

  // מתחילים בעריכה רק אם אין שם אירוע
  const [isEditingEventName, setIsEditingEventName] = useState(!hasEventName);

  const eventNameInputRef = useRef(null);

  // Auto-focus כשעוברים לעריכה
  useEffect(() => {
    if (isEditingEventName) {
      requestAnimationFrame(() => {
        eventNameInputRef.current?.focus?.();
      });
    }
  }, [isEditingEventName]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const enterEditMode = () => {
    setIsEditingEventName(true);
  };

  const exitEditModeIfValid = () => {
    if ((safeEventName ?? "").trim().length > 0) {
      setIsEditingEventName(false);
    }
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
        {/* Event Name */}
        {isEditingEventName ? (
          // מצב עריכה - TextInput עם "מסגרת" גרדיאנט
          <Animated.View
            entering={FadeInDown.duration(180)}
            exiting={FadeOutUp.duration(140)}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 14,
                padding: 2, // עובי המסגרת
                flex: 1,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <TextInput
                  ref={eventNameInputRef}
                  placeholder={
                    language === "he"
                      ? "🎉 שם האירוע (אופציונלי)..."
                      : "🎉 Event Name (optional)..."
                  }
                  value={safeEventName}
                  onChangeText={setEventName}
                  style={{
                    fontSize: 15,
                    color: "#0F172A",
                    textAlign: isRTL ? "right" : "left",
                    paddingVertical: 6,
                  }}
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                  onSubmitEditing={exitEditModeIfValid}
                  onBlur={exitEditModeIfValid}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        ) : hasEventName ? (
          // מצב תצוגה - כותרת צבעונית (לחיצה נכנסת לעריכה)
          <Animated.View
            entering={FadeInUp.duration(180)}
            exiting={FadeOutDown.duration(140)}
            style={[{ marginBottom: 16 }, animatedHeaderStyle]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={enterEditMode}
              onPressIn={() => {
                headerScale.value = withSpring(0.96, { damping: 14, stiffness: 300 });
              }}
              onPressOut={() => {
                headerScale.value = withSpring(1, { damping: 14, stiffness: 300 });
              }}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 18,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#667eea",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#FFFFFF",
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {safeEventName.trim()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

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
            maxLength={16}
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

          {isDuplicateParticipantName ? (
            <Text
              style={{
                marginTop: -6,
                marginBottom: 12,
                fontSize: 12,
                color: "#DC2626",
                textAlign: isRTL ? "right" : "left",
                fontWeight: "600",
              }}
            >
              {language === "he" ? "⚠️ השם הזה כבר קיים ברשימה" : "⚠️ This name already exists"}
            </Text>
          ) : null}

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

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}>
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
            onPress={() => {
              if (isDuplicateParticipantName) {
                Alert.alert(
                  language === "he" ? "שם כבר קיים" : "Name already exists",
                  language === "he"
                    ? "יש כבר משתתף עם השם הזה. בחר שם אחר."
                    : "A participant with the same name already exists. Please choose a different name."
                );
                return;
              }
              onAddParticipant?.();
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!canAdd}
            activeOpacity={0.9}
            style={{
              backgroundColor: canAdd ? "#667eea" : "#E5E7EB",
              borderRadius: 14,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              shadowColor: canAdd ? "#667eea" : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: participantName.trim() ? 6 : 0,
            }}
          >
            <Text
              style={{
                color: canAdd ? "#FFFFFF" : "#6B7280",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {t("addParticipant", language)}
            </Text>

            <UserPlus size={20} color={canAdd ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
