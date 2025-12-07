// src/i18n/layoutDirection.ts
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

export async function applyLayoutDirection(language: 'he' | 'en') {
  const isRTL = language === 'he';

  // אם כבר במצב הנכון – לא עושים כלום
  if (I18nManager.isRTL === isRTL) {
    return;
  }

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL);

  try {
    await Updates.reloadAsync();
  } catch (e) {
    console.log('Failed to reload after direction change', e);
  }
}
