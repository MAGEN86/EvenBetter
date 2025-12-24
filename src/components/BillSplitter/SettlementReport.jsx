import { View, Text, TouchableOpacity } from "react-native";
import { Share2 } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { t, getCurrencySymbol } from "@/utils/translations";
import { useLanguage } from "@/utils/useLanguage";
import { LinearGradient } from "expo-linear-gradient";


export function SettlementReport({
  settlement,
  roundAmounts,
  setRoundAmounts,
  onShare,
  eventName,
  participants,
}) {
  const shareButtonScale = useSharedValue(1);
  const { language, currency } = useLanguage();
  const isRTL = language === "he";
  const currencySymbol = getCurrencySymbol(currency);

  const animatedShareButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareButtonScale.value }],
  }));

  const handleSharePressIn = () => {
    shareButtonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handleSharePressOut = () => {
    shareButtonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  if (!settlement) return null;
    const vegByName = new Map((participants || []).map((p) => [p.name, p.isVegetarian]));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15).stiffness(100)}
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
<View style={{ marginBottom: 16 }}>
<LinearGradient
  colors={["#667eea", "#764ba2"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  }}
>
  {/* שורה ראשית */}
  <Text
    style={{
      fontSize: eventName ? 16 : 18,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
    }}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {eventName ? eventName : t("settlementReport", language)}
  </Text>

  {/* שורת משנה – רק אם יש שם אירוע */}
  {eventName && (
    <Text
      style={{
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "rgba(255,255,255,0.88)",
        textAlign: "center",
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {t("settlementReport", language)}
    </Text>
  )}
</LinearGradient>
</View>


      {settlement.error ? (
        <View
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 14,
            padding: 16,
            borderWidth: 2,
            borderColor: "#FED7D7",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#F04438",
              textAlign: isRTL ? "right" : "left",
              fontWeight: "600",
            }}
          >
            {settlement.error ===
            "No non-vegetarian participants to split meat costs"
              ? language === "he"
                ? "❌ אין משתתפים לא צמחוניים לחלוקת עלויות בשר"
                : "❌ No non-vegetarian participants to split meat costs"
              : settlement.error}
          </Text>
        </View>
      ) : (
        <View>
{/* Cost Summary */}
<View style={{ marginBottom: 20 }}>
  {/* Total Cost Card - Full Width */}
  <View
    style={{
      backgroundColor: "#F5F3FF",
      borderRadius: 14,
      padding: 18,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "#DDD6FE",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        fontSize: 14,
        color: "#7C3AED",
        marginBottom: 8,
        fontWeight: "600",
      }}
    >
      📊 {language === "he" ? 'סה"כ עלויות' : "Total Cost"}
    </Text>
    <Text
      style={{
        fontSize: 32,
        fontWeight: "800",
        color: "#6D28D9",
      }}
    >
      {currencySymbol}
      {(settlement.totalGeneral + settlement.totalMeat).toFixed(2)}
    </Text>
  </View>

  {/* Per Person Cards */}
  <View
    style={{
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
    }}
  >
    {/* Vegetarian Card */}
    <View
      style={{
        flex: 1,
        backgroundColor: "#F0FDF4",
        borderRadius: 14,
        padding: 16,
        borderWidth: 2,
        borderColor: "#BBF7D0",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#166534",
          marginBottom: 6,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        🌱 {language === "he" ? "עלות לאדם צמחוני" : "Cost per Vegetarian"}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#16A34A",
          textAlign: "center",
        }}
      >
        {currencySymbol}
        {settlement.generalPerPerson.toFixed(2)}
      </Text>
    </View>

    {/* Non-Vegetarian Card */}
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF7ED",
        borderRadius: 14,
        padding: 16,
        borderWidth: 2,
        borderColor: "#FED7AA",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#9A3412",
          marginBottom: 6,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        🍖 {language === "he" ? "עלות לאדם לא צמחוני" : "Cost per Non-Veg"}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#EA580C",
          textAlign: "center",
        }}
      >
        {currencySymbol}
        {(settlement.generalPerPerson + settlement.meatPerPerson).toFixed(2)}
      </Text>
    </View>
  </View>
</View>

          {/* Individual Balances */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#764ba2",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              👤 {t("breakdown", language)}
            </Text>
            {Object.values(settlement.balances).map((balance) => {
              return (
                <View
                  key={balance.name}
                  style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    borderWidth: 2,
                    borderColor: "#C7D2FE",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      minWidth: 0, // ✅ חשוב
                      alignItems: isRTL ? "flex-end" : "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "center",
                        gap: 6,
                        alignSelf: isRTL ? "flex-end" : "flex-start",
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        {vegByName.get(balance.name) ? "🌱" : "🍖"}
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: "#667eea",
                          textAlign: isRTL ? "right" : "left",
                          writingDirection: isRTL ? "rtl" : "ltr",
                          alignSelf: isRTL ? "flex-end" : "flex-start",
                        }}
                      >
                        {balance.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginTop: 2,

                        textAlign: isRTL ? "right" : "left",
                        writingDirection: isRTL ? "rtl" : "ltr",
                        alignSelf: isRTL ? "flex-end" : "flex-start",
                      }}
                    >
                      {language === "he"
                        ? `עלות: ${currencySymbol}${balance.share.toFixed(2)} • שילם: ${currencySymbol}${balance.paid.toFixed(2)}`
                        : `Cost: ${currencySymbol}${balance.share.toFixed(2)} • Paid: ${currencySymbol}${balance.paid.toFixed(2)}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      borderRadius: 8,
                      minWidth: 68,   // ✅ שהטקסט לא ייכנס אליו
                      flexShrink: 0,  // ✅ שלא יידחס
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: balance.balance === 0 ? 18 : 14,   // ✅ ה־✓ קצת גדול יותר
                        fontWeight: "700",
                        lineHeight: balance.balance === 0 ? 18 : 14, // ✅ קריטי למרכז אנכי
                        color:
                          balance.balance > 0.01
                            ? "#10B981"
                            : balance.balance < -0.01
                              ? "#F04438"
                              : "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      {balance.balance > 0.01
                        ? `+${currencySymbol}${balance.balance.toFixed(2)}`
                        : balance.balance < -0.01
                          ? `-${currencySymbol}${Math.abs(balance.balance).toFixed(2)}`
                          : "✓"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Transactions */}
          {settlement.transactions.length > 0 && (
            <View>
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#764ba2",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  💸{" "}
                  {language === "he"
                    ? "תשלומים"
                    : "Payments"}
                </Text>
                <TouchableOpacity
                  onPress={() => setRoundAmounts(!roundAmounts)}
                  style={{
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "#F9FAFB",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: roundAmounts ? "#667eea" : "#E0E7FF",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#764ba2",
                      fontWeight: "600",
                    }}
                  >
                    💫 {language === "he" ? "עיגול" : "Round"}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: roundAmounts ? "#667eea" : "#D1D5DB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {roundAmounts && (
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {settlement.transactions.map((t, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "#F3E8FF",
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 10,
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      borderWidth: 2,
                      borderColor: "#D8B4FE",
                      shadowColor: "#764ba2",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        minWidth: 0, // ✅ חובה כדי לאפשר שבירה אמיתית
                        flexDirection: isRTL ? "row-reverse" : "row",
                        flexWrap: "wrap", // ✅ ירידת שורה
                        alignItems: "center",
                        gap: 8, // אם ה-RN שלך תומך gap זה בסדר להשאיר
                      }}
                    >

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: "#764ba2",
                          flexShrink: 1, // ✅ מאפשר להישבר
                        }}
                      >
                        {t.from}
                      </Text>

                      <Text style={{ fontSize: 16, color: "#6B7280" }}>
                        {isRTL ? "←" : "→"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: "#764ba2",
                          flexShrink: 1, // ✅ מאפשר להישבר
                        }}
                      >
                        {t.to}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 6,      // 🔹 קצת פחות עגול
                        minWidth: 72,         // 🔹 קטן יותר
                        height: 28,           // 🔹 גובה קבוע וקטן
                        paddingHorizontal: 8, // 🔹 פחות רווח
                        flexShrink: 0,
                        alignSelf: "center",

                        // ✅ מרכז אמיתי
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >


                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "800",
                          color: "#764ba2",
                        }}
                      >
                        {currencySymbol}
                        {roundAmounts
                          ? Math.round(t.amount)
                          : t.amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* Share Button */}
              <Animated.View style={animatedShareButtonStyle}>
                <TouchableOpacity
                  onPress={onShare}
                  onPressIn={handleSharePressIn}
                  onPressOut={handleSharePressOut}
                  activeOpacity={0.9}
                  style={{
                    backgroundColor: "#667eea",
                    borderRadius: 14,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 8,
                    shadowColor: "#667eea",
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
                    {t("share", language)}
                  </Text>
                  <Share2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}
