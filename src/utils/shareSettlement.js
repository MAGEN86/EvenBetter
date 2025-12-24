import { Alert } from "react-native";
import RNShare from "react-native-share";
import { t, getCurrencySymbol } from "./translations";
import { getShareImageUri } from "./shareImage";
import { getShareIncludeImage } from "@/utils/settings/sharePrefs";

/**
 * Checks if text contains RTL characters (Hebrew, Arabic, etc.)
 */
function isRTLText(text) {
  if (!text) return false;
  const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF]/;
  return rtlRegex.test(text);
}

function getDirectionMark(fromName, toName) {
  if (isRTLText(fromName) || isRTLText(toName)) return "\u200F";
  return "\u200E";
}

function getArrowDirection(fromName, toName) {
  if (isRTLText(fromName) || isRTLText(toName)) return "←";
  return "→";
}

function isShareCancelled(error) {
  const msg = (error?.message || "").toString().toLowerCase();
  return msg.includes("user did not share");
}

export async function shareSettlement(
  settlement,
  roundAmounts,
  language = "he",
  currency = "ILS",
  eventName = "",
) {
  if (!settlement || !settlement.transactions) {
    Alert.alert(
      language === "he" ? "שגיאה" : "Error",
      language === "he" ? "אין נתונים לשיתוף" : "No data to share",
    );
    return;
  }

  const currencySymbol = getCurrencySymbol(currency);
  const dirMark = language === "he" ? "\u200F" : "\u200E";

  try {
    const cleanEventName = (eventName ?? "")
      .toString()
      .replace(/\*/g, "")
      .trim();

    let message = cleanEventName
      ? `${dirMark}*${cleanEventName}*\n${dirMark}`
      : `${dirMark}${t("shareMessage", language)}\n${dirMark}`;

    message += "━━━━━━━━━━━━━━━━━━━━\n\n";

    const totalMealCost = settlement.totalGeneral + settlement.totalMeat;
    message += `${dirMark}📊 ${
      language === "he" ? "סה\"כ עלויות" : "Total Cost"
    }: ${currencySymbol}${totalMealCost.toFixed(2)}\n\n`;

    message += `${dirMark}💰 ${t(
      "generalExpenses",
      language,
    )}: ${currencySymbol}${settlement.totalGeneral.toFixed(2)}\n`;
    message += `${dirMark}🥩 ${t(
      "meatExpenses",
      language,
    )}: ${currencySymbol}${settlement.totalMeat.toFixed(2)}\n\n`;

    message += `${dirMark}🌱 ${
      language === "he" ? "עלות צמחוני" : "Cost Vegetarian"
    }: ${currencySymbol}${settlement.generalPerPerson.toFixed(2)}\n`;
    message += `${dirMark}🍖 ${
      language === "he" ? "עלות לא צמחוני" : "Cost Non-Veg"
    }: ${currencySymbol}${(
      settlement.generalPerPerson + settlement.meatPerPerson
    ).toFixed(2)}\n\n`;

    message += `${dirMark}💸 ${
      language === "he" ? "תשלומים להעברה" : "Payments to Transfer"
    }:\n`;
    message += "━━━━━━━━━━━━━━━━━━━━\n";

    settlement.transactions.forEach((tx, i) => {
      const amount = roundAmounts ? Math.round(tx.amount) : tx.amount.toFixed(2);

      const transactionDirMark = getDirectionMark(tx.from, tx.to);
      const arrow = getArrowDirection(tx.from, tx.to);

      message += `${transactionDirMark}${i + 1}. ${tx.from} ${arrow} ${tx.to}\n`;
      message += `   ${transactionDirMark}${currencySymbol}${amount}\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━━━\n";
    message +=
      language === "he" ? "נוצר עם EvenBetter 🦊" : "Created with EvenBetter 🦊";

    // ✅ NEW: Respect user setting (image+text vs text only)
    const includeImage = await getShareIncludeImage();

    if (includeImage) {
      const imageUri = await getShareImageUri();

      // אם ההודעה ארוכה מדי, וואטסאפ לפעמים זורקת את הטקסט מהתמונה
      const MAX_SAFE = 900;

      // 1) נסה שיתוף ישיר לוואטסאפ
      try {
        await RNShare.shareSingle({
          social: RNShare.Social.WHATSAPP,
          url: imageUri,
          type: "image/png",
          message: message.length > MAX_SAFE ? message.slice(0, MAX_SAFE) : message,
        });
      } catch (e) {
        // 2) fallback: אם אין וואטסאפ / נכשל – פתח chooser רגיל
        await RNShare.open({
          url: imageUri,
          type: "image/png",
          filename: "foxy.png",
          message: message.length > MAX_SAFE ? message.slice(0, MAX_SAFE) : message,
          failOnCancel: false,
        });
      }

      // 3) אם ההודעה ארוכה, שלח את ההמשך כטקסט נפרד כדי שהמשתמש לא יאבד מידע
      if (message.length > MAX_SAFE) {
        const rest = message.slice(MAX_SAFE);
        await RNShare.open({ message: rest });
      }
    } else {
      // טקסט בלבד – שיתוף רגיל
      await RNShare.open({ message });
    }


    console.log("✅ Share sheet opened");
  } catch (error) {
    // אם המשתמש סגר את חלון השיתוף בלי לשתף – לא מציגים הודעה
    if (isShareCancelled(error)) {
      console.log("ℹ️ Share cancelled by user");
      return;
    }

    console.error("❌ Error in shareSettlement:", error);
    Alert.alert(
      language === "he" ? "שגיאה" : "Error",
      language === "he"
        ? `לא ניתן לשתף. נסה שוב.\n\nפרטי שגיאה: ${error.message}`
        : `Cannot share. Try again.\n\nError details: ${error.message}`,
    );
  }

}
