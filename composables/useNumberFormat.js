export const useNumberFormat = () => {
  // فرمت کردن عدد با جداکننده سه رقمی
  const formatNumber = (value) => {
    if (!value) return "";
    // حذف همه چیز به جز اعداد
    const numericValue = value.toString().replace(/\D/g, "");
    // اضافه کردن کاما هر سه رقم
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // برگرداندن عدد خام (بدون کاما)
  const parseNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/,/g, "");
  };

  // تبدیل عدد به حروف فارسی
  const numberToWords = (value) => {
    if (!value) return "";
    const numericValue = parseNumber(value);
    if (!numericValue || numericValue === "0") return "";

    const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const hundreds = [
      "",
      "یکصد",
      "دویست",
      "سیصد",
      "چهارصد",
      "پانصد",
      "ششصد",
      "هفتصد",
      "هشتصد",
      "نهصد",
    ];
    const teens = [
      "ده",
      "یازده",
      "دوازده",
      "سیزده",
      "چهارده",
      "پانزده",
      "شانزده",
      "هفده",
      "هجده",
      "نوزده",
    ];

    const convertGroup = (num) => {
      if (num === 0) return "";
      let result = "";
      const h = Math.floor(num / 100);
      const t = Math.floor((num % 100) / 10);
      const o = num % 10;

      if (h > 0) result += hundreds[h];
      if (t === 1) {
        if (result) result += " و ";
        result += teens[o];
      } else {
        if (t > 0) {
          if (result) result += " و ";
          result += tens[t];
        }
        if (o > 0) {
          if (result) result += " و ";
          result += ones[o];
        }
      }
      return result;
    };

    try {
      const num = parseInt(numericValue);
      if (num === 0) return "صفر تومان";

      const billion = Math.floor(num / 1000000000);
      const million = Math.floor((num % 1000000000) / 1000000);
      const thousand = Math.floor((num % 1000000) / 1000);
      const remainder = num % 1000;

      let result = "";

      if (billion > 0) {
        result += convertGroup(billion) + " میلیارد";
      }
      if (million > 0) {
        if (result) result += " و ";
        result += convertGroup(million) + " میلیون";
      }
      if (thousand > 0) {
        if (result) result += " و ";
        result += convertGroup(thousand) + " هزار";
      }
      if (remainder > 0) {
        if (result) result += " و ";
        result += convertGroup(remainder);
      }

      return result + " تومان";
    } catch {
      return "";
    }
  };

  return {
    formatNumber,
    parseNumber,
    numberToWords,
  };
};
