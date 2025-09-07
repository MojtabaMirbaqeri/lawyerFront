import { getBankByCardNumber } from "iranian-bank-list";

export const useGetBankLogo = (cardNumber, size = 20) => {
  // اگر شماره کارت وجود ندارد یا کوتاه‌تر از ۱۶ رقم است، آن را با '1' کامل کن
  let processedCardNumber = cardNumber || "";
  if (processedCardNumber.length < 16) {
    processedCardNumber = processedCardNumber.padEnd(16, "1");
  }

  const bank = getBankByCardNumber(processedCardNumber);
  if (!bank || !bank.bank_logo) return "";

  let svg = bank.bank_logo; // اگر width و height از قبل وجود دارن، حذف‌شون کن

  svg = svg.replace(/\s(width|height)="[^"]*"/g, ""); // اگه viewBox نداره، یکی اضافه کن

  if (!/viewBox="/.test(svg)) {
    const widthMatch = svg.match(/width="(\d+)"/);
    const heightMatch = svg.match(/height="(\d+)"/);
    const w = widthMatch ? widthMatch[1] : size;
    const h = heightMatch ? heightMatch[1] : size;
    svg = svg.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${w} ${h}">`);
  } // در نهایت width و height جدید ست کن

  svg = svg.replace(/<svg([^>]*)>/, `<svg$1 width="${size}" height="${size}">`);

  return svg;
};
