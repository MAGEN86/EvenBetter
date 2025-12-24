import { useAuth } from "@/utils/auth/useAuth";
import { useLanguage } from "@/utils/useLanguage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  const { loadLanguage, isLoaded: isLangLoaded, language, currency } = useLanguage();

  useEffect(() => {
    console.log("[RootLayout] initiate auth + loadLanguage");
    initiate();
    loadLanguage();
  }, [initiate, loadLanguage]);

  useEffect(() => {
    console.log("[RootLayout] readiness:", { isReady, isLangLoaded, language, currency });

    if (isReady && isLangLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, isLangLoaded, language, currency]);

  // לא מציגים כלום עד ששניהם מוכנים
  if (!isReady || !isLangLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
