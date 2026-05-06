const REPLACEMENTS: Array<[RegExp, string]> = [
  [/swiggy/gi, "Swiggy"],
  [/zomato/gi, "Zomato"],
  [/zepto/gi, "Zepto"],
  [/blinkit/gi, "Blinkit"],
  [/amazon\s?pay|amzn|amazon/gi, "Amazon Pay"],
  [/phonepe|fonepe/gi, "PhonePe"],
  [/paytm/gi, "Paytm"],
  [/gpay|google\s?pay/gi, "Google Pay"],
  [/mobikwik/gi, "MobiKwik"],
  [/spotify/gi, "Spotify"],
  [/netflix/gi, "Netflix"],
  [/hotstar|disney/gi, "Disney+ Hotstar"],
  [/prime\s?video|primevideo/gi, "Amazon Prime"],
  [/youtube\s?premium/gi, "YouTube Premium"],
  [/jio/gi, "Jio"],
  [/airtel/gi, "Airtel"],
  [/bsnl/gi, "BSNL"],
  [/vodafone|vi\b/gi, "Vi (Vodafone)"],
  [/uber/gi, "Uber"],
  [/ola\b/gi, "Ola"],
  [/rapido/gi, "Rapido"],
  [/irctc/gi, "IRCTC"],
  [/makemytrip|mmt/gi, "MakeMyTrip"],
  [/yatra/gi, "Yatra"],
  [/bigbasket/gi, "BigBasket"],
  [/grofers|blinkit/gi, "Blinkit"],
  [/dunzo/gi, "Dunzo"],
  [/myntra/gi, "Myntra"],
  [/flipkart/gi, "Flipkart"],
  [/meesho/gi, "Meesho"],
  [/nykaa/gi, "Nykaa"],
  [/hdfc/gi, "HDFC Bank"],
  [/icici/gi, "ICICI Bank"],
  [/sbi\b/gi, "SBI"],
  [/axis\s?bank/gi, "Axis Bank"],
  [/kotak/gi, "Kotak Bank"],
];

export function normalizeMerchant(raw: string): string {
  if (!raw) return "Unknown Merchant";

  let cleaned = raw
    .replace(/upi|p2m|p2p|txn|trf|ref|id|paid to|payment to/gi, " ")
    .replace(/[|/_\-.:]+/g, " ")
    .replace(/\b\d{6,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, label] of REPLACEMENTS) {
    if (pattern.test(cleaned)) return label;
  }

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 0) return "Unknown Merchant";

  return parts
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
