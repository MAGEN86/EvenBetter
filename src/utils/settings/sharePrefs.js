import AsyncStorage from "@react-native-async-storage/async-storage";

// המפתח החדש
const KEY = "share_include_image";

// אם פעם השתמשת במפתח אחר — תשאיר כדי "לזכור" למשתמשים קיימים
const LEGACY_KEYS = ["shareIncludeImage", "share_include_image"];

function parseStoredValue(v) {
  if (v == null) return null;

  // תומך בפורמטים שונים: "1"/"0", "true"/"false"
  if (v === "1") return true;
  if (v === "0") return false;
  if (v === "true") return true;
  if (v === "false") return false;

  // fallback – אם פעם שמרת JSON.stringify(true/false)
  try {
    const parsed = JSON.parse(v);
    return !!parsed;
  } catch {
    return null;
  }
}

export async function getShareIncludeImage() {
  // קודם ננסה את המפתח החדש
  let v = await AsyncStorage.getItem(KEY);
  let parsed = parseStoredValue(v);

  // אם אין שם כלום — ננסה מפתחות ישנים (מיגרציה)
  if (parsed === null) {
    for (const k of LEGACY_KEYS) {
      v = await AsyncStorage.getItem(k);
      parsed = parseStoredValue(v);
      if (parsed !== null) break;
    }
  }

  // ברירת מחדל: OFF
  return parsed === null ? false : parsed;
}

export async function setShareIncludeImage(value) {
  const v = value ? "1" : "0";
  await AsyncStorage.setItem(KEY, v);
}
