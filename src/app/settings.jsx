import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Shield,
  Info,
  Languages,
  DollarSign,
  Share2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useLanguage } from "@/utils/useLanguage";
import { t } from "@/utils/translations";
import {
  getShareIncludeImage,
  setShareIncludeImage,
} from "@/utils/settings/sharePrefs";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    language,
    currency,
    toggleLanguage,
    setCurrency,
    loadLanguage,
    isLoaded,
  } = useLanguage();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // ✅ New: share preference
  const [includeImageInShare, setIncludeImageInShareState] = useState(false);


  const handleToggleLanguage = () => {
    toggleLanguage();
  };

  useEffect(() => {
    loadLanguage();

    (async () => {
      const v = await getShareIncludeImage();
      setIncludeImageInShareState(v);
    })();
  }, []);

  const handleEmailPress = () => {
    Linking.openURL("mailto:aptdm86@gmail.com");
  };

  const currencies = [
    { code: "ILS", label: t("currencyILS", language) },
    { code: "USD", label: t("currencyUSD", language) },
    { code: "EUR", label: t("currencyEUR", language) },
    { code: "GBP", label: t("currencyGBP", language) },
  ];

  const handleCurrencySelect = (currencyCode) => {
    setCurrency(currencyCode);
    setShowCurrencyModal(false);
  };

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F9FAFB" }} />;
  }

  const isRTL = language === "he";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const PrivacyArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <ArrowIcon size={20} color="#3562FF" />
            <Text style={{ fontSize: 14, color: "#3562FF", fontWeight: "500" }}>
              {t("back", language)}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#0F172A",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("settings", language)}
          </Text>
        </View>

        {/* Language Toggle */}
        <TouchableOpacity
          onPress={handleToggleLanguage}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            flexDirection: isRTL ? "row" : "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: "#EEF2FF",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 2,
              borderColor: "#C7D2FE",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#667eea",
              }}
            >
              {language === "he" ? "עברית" : "English"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Languages size={20} color="#6B7280" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0F172A",
              }}
            >
              {t("language", language)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Currency Selection */}
        <TouchableOpacity
          onPress={() => setShowCurrencyModal(true)}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            flexDirection: isRTL ? "row" : "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: "#EEF2FF",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 2,
              borderColor: "#C7D2FE",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#667eea",
              }}
            >
              {currencies.find((c) => c.code === currency)?.label ||
                t("currencyILS", language)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <DollarSign size={20} color="#6B7280" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0F172A",
              }}
            >
              {t("currency", language)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ✅ NEW: Share Preference (Image + Text vs Text Only) */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >
              <Share2 size={20} color="#6B7280" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#0F172A",
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                  flex: 1,
                }}
              >
                {language === "he"
                  ? "שיתוף: לצרף תמונה לדוח"
                  : "Share: include image in report"}
              </Text>
            </View>

            <Switch
              value={includeImageInShare}
              onValueChange={async (v) => {
                setIncludeImageInShareState(v);
                await setShareIncludeImage(v);
              }}
            />
          </View>
          {/* 🦊 Foxy – הסבר עדין */}
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              marginTop: 12,
              backgroundColor: "#F8FAFC",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Image
              source={require("../../assets/images/FoxyNoBG.png")}
              style={{ width: 64, height: 64 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 18,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {language === "he"
                ? "לפעמים וואטסאפ שולח רק תמונה בלי טקסט. לכן זה כבוי כברירת מחדל — מוזמנים להדליק ולנסות."
                : "WhatsApp may sometimes send only the image without text. That’s why it’s off by default - feel free to turn it on and try."}
            </Text>
          </View>



        </View>

        {/* Currency Modal */}
        <Modal
          transparent={true}
          visible={showCurrencyModal}
          animationType="fade"
          onRequestClose={() => setShowCurrencyModal(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            onPress={() => setShowCurrencyModal(false)}
          >
            <Pressable
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 24,
                width: "100%",
                maxWidth: 400,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#0F172A",
                  marginBottom: 16,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("currency", language)}
              </Text>
              <View style={{ gap: 8 }}>
                {currencies.map((curr) => (
                  <TouchableOpacity
                    key={curr.code}
                    onPress={() => handleCurrencySelect(curr.code)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor:
                        currency === curr.code ? "#667eea" : "#E5E7EB",
                      backgroundColor:
                        currency === curr.code ? "#EEF2FF" : "#F9FAFB",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: currency === curr.code ? "#667eea" : "#0F172A",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {curr.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setShowCurrencyModal(false)}
                style={{
                  marginTop: 16,
                  backgroundColor: "#F9FAFB",
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#0F172A",
                  }}
                >
                  {t("close", language)}
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* App Info */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Info size={20} color="#6B7280" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0F172A",
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
                flex: 1,
              }}
            >
              {t("about", language)}
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("aboutText", language)}
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Mail size={20} color="#6B7280" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0F172A",
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
                flex: 1,
              }}
            >
              {t("contactTitle", language)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 22,
              textAlign: isRTL ? "right" : "left",
              marginBottom: 12,
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {t("contactText", language)}
          </Text>
          <TouchableOpacity
            onPress={handleEmailPress}
            style={{
              backgroundColor: "#3562FF",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {t("contactEmail", language)}
            </Text>
            <Mail size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Privacy Policy Link */}
        <TouchableOpacity
          onPress={() => router.push("/privacy")}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Shield size={20} color="#6B7280" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0F172A",
              }}
            >
              {t("privacyPolicy", language)}
            </Text>
          </View>
          <PrivacyArrow size={20} color="#6B7280" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
