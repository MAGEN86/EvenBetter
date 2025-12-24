import { Skia } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";
import { getCurrencySymbol } from "./translations";

export async function generateSettlementImage(
  settlement,
  roundAmounts,
  currency = "ILS",
  eventName = "",
) {
  const currencySymbol = getCurrencySymbol(currency);

  try {
    // Create canvas with proper dimensions
    const width = 600;
    const totalTransactions = settlement.transactions.length;
    const height = 400 + totalTransactions * 70;

    const surface = Skia.Surface.Make(width, height);
    if (!surface) throw new Error("Could not create surface");

    const canvas = surface.getCanvas();

    // Clear background
    canvas.clear(Skia.Color("#FFFFFF"));

    // Helper to create paint
    const createPaint = (color) => {
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(color));
      paint.setAntiAlias(true);
      return paint;
    };

    // Background
    const bgPaint = createPaint("#F8FAFC");
    canvas.drawRect(Skia.XYWHRect(0, 0, width, height), bgPaint);

    // Header background
    const headerPaint = createPaint("#3562FF");
    canvas.drawRect(Skia.XYWHRect(0, 0, width, 120), headerPaint);

// Title
const titlePaint = createPaint("#FFFFFF");
const titleFont = Skia.Font(null, 32);
const titleText = eventName ? `${eventName} ✅` : "סיכום חשבון ✅";
const titleBlob = Skia.TextBlob.MakeFromText(titleText, titleFont);
const titleWidth = titleFont.measureText(titleText);
canvas.drawTextBlob(titleBlob, (width - titleWidth) / 2, 50, titlePaint);

    // Subtitle
    const subtitlePaint = createPaint("#E0E7FF");
    const subtitleFont = Skia.Font(null, 16);
    const subtitleText = "EvenBetter 💰";
    const subtitleBlob = Skia.TextBlob.MakeFromText(subtitleText, subtitleFont);
    const subtitleWidth = subtitleFont.measureText(subtitleText);
    canvas.drawTextBlob(
      subtitleBlob,
      (width - subtitleWidth) / 2,
      85,
      subtitlePaint,
    );

    let y = 160;

    // Summary boxes
    const boxWidth = 260;
    const boxHeight = 100;
    const boxX1 = 40;
    const boxX2 = 300;

    // General cost box
    const generalBoxPaint = createPaint("#ECFDF5");
    canvas.drawRRect(
      Skia.RRectXY(Skia.XYWHRect(boxX1, y, boxWidth, boxHeight), 16, 16),
      generalBoxPaint,
    );

    const labelFont = Skia.Font(null, 14);
    const labelPaint = createPaint("#6B7280");
    const generalLabelText = 'סה"כ עלות כללית';
    const generalLabelBlob = Skia.TextBlob.MakeFromText(
      generalLabelText,
      labelFont,
    );
    const generalLabelWidth = labelFont.measureText(generalLabelText);
    canvas.drawTextBlob(
      generalLabelBlob,
      boxX1 + (boxWidth - generalLabelWidth) / 2,
      y + 35,
      labelPaint,
    );

    const amountFont = Skia.Font(null, 28);
    const amountPaint = createPaint("#12B76A");
    const generalAmountText = `${currencySymbol}${settlement.totalGeneral.toFixed(2)}`;
    const generalAmountBlob = Skia.TextBlob.MakeFromText(
      generalAmountText,
      amountFont,
    );
    const generalAmountWidth = amountFont.measureText(generalAmountText);
    canvas.drawTextBlob(
      generalAmountBlob,
      boxX1 + (boxWidth - generalAmountWidth) / 2,
      y + 75,
      amountPaint,
    );

    // Meat cost box
    const meatBoxPaint = createPaint("#FEF3F2");
    canvas.drawRRect(
      Skia.RRectXY(Skia.XYWHRect(boxX2, y, boxWidth, boxHeight), 16, 16),
      meatBoxPaint,
    );

    const meatLabelText = 'סה"כ עלות בשר';
    const meatLabelBlob = Skia.TextBlob.MakeFromText(meatLabelText, labelFont);
    const meatLabelWidth = labelFont.measureText(meatLabelText);
    canvas.drawTextBlob(
      meatLabelBlob,
      boxX2 + (boxWidth - meatLabelWidth) / 2,
      y + 35,
      labelPaint,
    );

    const meatAmountPaint = createPaint("#F04438");
    const meatAmountText = `${currencySymbol}${settlement.totalMeat.toFixed(2)}`;
    const meatAmountBlob = Skia.TextBlob.MakeFromText(
      meatAmountText,
      amountFont,
    );
    const meatAmountWidth = amountFont.measureText(meatAmountText);
    canvas.drawTextBlob(
      meatAmountBlob,
      boxX2 + (boxWidth - meatAmountWidth) / 2,
      y + 75,
      meatAmountPaint,
    );

    y += 140;

    // Transactions header
    const headerFont = Skia.Font(null, 20);
    const headerTextPaint = createPaint("#0F172A");
    const transHeaderText = "💸 תשלומים להעברה";
    const transHeaderBlob = Skia.TextBlob.MakeFromText(
      transHeaderText,
      headerFont,
    );
    const transHeaderWidth = headerFont.measureText(transHeaderText);
    canvas.drawTextBlob(
      transHeaderBlob,
      (width - transHeaderWidth) / 2,
      y,
      headerTextPaint,
    );

    y += 40;

    // Transactions
    const transFont = Skia.Font(null, 18);
    const transNamePaint = createPaint("#0F172A");
    const transAmountPaint = createPaint("#12B76A");

    settlement.transactions.forEach((t, i) => {
      // Background
      const transBoxPaint = createPaint(i % 2 === 0 ? "#F9FAFB" : "#FFFFFF");
      canvas.drawRRect(
        Skia.RRectXY(Skia.XYWHRect(40, y, 520, 60), 12, 12),
        transBoxPaint,
      );

      // Border
      const borderPaint = createPaint("#E5E7EB");
      borderPaint.setStyle(1); // Stroke
      borderPaint.setStrokeWidth(1);
      canvas.drawRRect(
        Skia.RRectXY(Skia.XYWHRect(40, y, 520, 60), 12, 12),
        borderPaint,
      );

      // Transaction text
      const amount = roundAmounts ? Math.round(t.amount) : t.amount.toFixed(2);
      const transText = `${t.from} → ${t.to}`;
      const transBlob = Skia.TextBlob.MakeFromText(transText, transFont);
      const transWidth = transFont.measureText(transText);
      canvas.drawTextBlob(
        transBlob,
        300 - transWidth / 2,
        y + 28,
        transNamePaint,
      );

      // Amount
      const amountText = `${currencySymbol}${amount}`;
      const amountBlob = Skia.TextBlob.MakeFromText(amountText, transFont);
      const amtWidth = transFont.measureText(amountText);
      canvas.drawTextBlob(
        amountBlob,
        300 - amtWidth / 2,
        y + 50,
        transAmountPaint,
      );

      y += 70;
    });

    // Get image and convert to base64
    const image = surface.makeImageSnapshot();
    if (!image) throw new Error("Failed to create image snapshot");

    const bytes = image.encodeToBytes();
    if (!bytes) throw new Error("Failed to encode image");

    // Convert bytes to base64
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Image = btoa(binary);

    // Save to file
    const filePath = `${FileSystem.cacheDirectory}settlement-${Date.now()}.png`;
    await FileSystem.writeAsStringAsync(filePath, base64Image, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Image saved to:", filePath);
    return filePath;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
