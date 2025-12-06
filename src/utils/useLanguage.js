import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_STORAGE_KEY = "@evenbetter_language";
const CURRENCY_STORAGE_KEY = "@evenbetter_currency";

export const useLanguage = create((set) => ({
  language: "he", // default to Hebrew
  isLoaded: false,
  currency: "ILS", // default to Israeli Shekel
  setLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      set({ language: lang });
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },
  toggleLanguage: async () => {
    try {
      const currentLang = useLanguage.getState().language;
      const newLang = currentLang === "he" ? "en" : "he";
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      set({ language: newLang });
    } catch (error) {
      console.error("Error toggling language:", error);
    }
  },
  setCurrency: async (curr) => {
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, curr);
      set({ currency: curr });
    } catch (error) {
      console.error("Error saving currency:", error);
    }
  },
  loadLanguage: async () => {
    try {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      set({
        language: savedLang || "he",
        currency: savedCurrency || "ILS",
        isLoaded: true,
      });
    } catch (error) {
      console.error("Error loading language:", error);
      set({ isLoaded: true });
    }
  },
}));
