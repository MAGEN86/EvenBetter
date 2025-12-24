import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

const LANGUAGE_STORAGE_KEY = "@evenbetter_language";
const CURRENCY_STORAGE_KEY = "@evenbetter_currency";

function getRegionCodeSafe() {
  try {
    const locales = Localization.getLocales?.() || [];
    const regionCode =
      locales?.[0]?.regionCode ||
      locales?.[0]?.countryCode || // fallback ישן
      null;

    console.log("[useLanguage] device locales:", locales);
    console.log("[useLanguage] regionCode:", regionCode);

    return regionCode;
  } catch (e) {
    console.log("[useLanguage] failed to read regionCode:", e);
    return null;
  }
}

function getDefaultsByRegion(regionCode) {
  // דרישתך:
  // IL => עברית + ILS
  // else => אנגלית + USD
  if (regionCode === "IL") {
    return { language: "he", currency: "ILS" };
  }
  return { language: "en", currency: "USD" };
}

export const useLanguage = create((set, get) => ({
  language: "he",
  currency: "ILS",
  isLoaded: false,

  setLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      set({ language: lang });

      console.log("[useLanguage] setLanguage ->", lang);
    } catch (error) {
      console.error("[useLanguage] Error saving language:", error);
    }
  },

  toggleLanguage: async () => {
    try {
      const currentLang = get().language;
      const newLang = currentLang === "he" ? "en" : "he";
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      set({ language: newLang });

      console.log("[useLanguage] toggleLanguage:", currentLang, "->", newLang);
    } catch (error) {
      console.error("[useLanguage] Error toggling language:", error);
    }
  },

  setCurrency: async (curr) => {
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, curr);
      set({ currency: curr });

      console.log("[useLanguage] setCurrency ->", curr);
    } catch (error) {
      console.error("[useLanguage] Error saving currency:", error);
    }
  },

  loadLanguage: async () => {
    try {
      console.log("[useLanguage] loadLanguage: start");

      const [savedLang, savedCurrency] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        AsyncStorage.getItem(CURRENCY_STORAGE_KEY),
      ]);

      console.log("[useLanguage] savedLang:", savedLang);
      console.log("[useLanguage] savedCurrency:", savedCurrency);

      const regionCode = getRegionCodeSafe();
      const regionDefaults = getDefaultsByRegion(regionCode);

      const finalLanguage = savedLang || regionDefaults.language;
      const finalCurrency = savedCurrency || regionDefaults.currency;

      console.log("[useLanguage] regionDefaults:", regionDefaults);
      console.log("[useLanguage] finalLanguage:", finalLanguage);
      console.log("[useLanguage] finalCurrency:", finalCurrency);

      set({
        language: finalLanguage,
        currency: finalCurrency,
        isLoaded: true,
      });

      console.log("[useLanguage] loadLanguage: done");
    } catch (error) {
      console.error("[useLanguage] Error loading language:", error);

      // fallback בטוח לפי הדרישה
      const regionCode = getRegionCodeSafe();
      const regionDefaults = getDefaultsByRegion(regionCode);

      set({
        language: regionDefaults.language,
        currency: regionDefaults.currency,
        isLoaded: true,
      });

      console.log("[useLanguage] loadLanguage: fallback defaults used", regionDefaults);
    }
  },
}));
