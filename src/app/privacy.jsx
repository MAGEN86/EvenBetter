import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, ArrowLeft } from "lucide-react-native";
import { useEffect } from "react";
import { useLanguage } from "@/utils/useLanguage";
import { t } from "@/utils/translations";

export default function PrivacyPolicy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, loadLanguage, isLoaded } = useLanguage();

  useEffect(() => {
    loadLanguage();
  }, []);

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F9FAFB" }} />;
  }

  const isRTL = language === "he";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

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
            {t("privacyPolicyTitle", language)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginTop: 8,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("lastUpdated", language)}
          </Text>
        </View>

        {/* Content */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          {/* Introduction */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("introduction", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("introText", language)}
            </Text>
          </View>

          {/* Data Collection */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("dataCollectionTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                marginBottom: 12,
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("dataCollectionText", language)}
            </Text>
            <View
              style={{
                paddingRight: isRTL ? 16 : 0,
                paddingLeft: isRTL ? 0 : 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 22,
                  textAlign: isRTL ? "right" : "left",
                  marginBottom: 8,
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {t("dataCollectionItem1", language)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 22,
                  textAlign: isRTL ? "right" : "left",
                  marginBottom: 8,
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {t("dataCollectionItem2", language)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 22,
                  textAlign: isRTL ? "right" : "left",
                  marginBottom: 8,
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {t("dataCollectionItem3", language)}
              </Text>
            </View>
          </View>

          {/* Data Storage */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("dataStorageTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("dataStorageText", language)}
            </Text>
          </View>

          {/* Data Usage */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("dataUsageTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("dataUsageText", language)}
            </Text>
          </View>

          {/* Data Deletion */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("dataDeletionTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("dataDeletionText", language)}
            </Text>
          </View>

          {/* Third Party Services */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("thirdPartyTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("thirdPartyText", language)}
            </Text>
          </View>

          {/* Children's Privacy */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("childrenPrivacyTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("childrenPrivacyText", language)}
            </Text>
          </View>

          {/* Changes to Policy */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("policyChangesTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("policyChangesText", language)}
            </Text>
          </View>

          {/* Contact */}
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#0F172A",
                marginBottom: 12,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("contactTitle", language)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 22,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("contactText", language)}
              {"\n"}
              <Text style={{ fontWeight: "600", color: "#3562FF" }}>
                {t("contactEmail", language)}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
