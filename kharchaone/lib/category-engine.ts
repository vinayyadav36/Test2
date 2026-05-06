import { Category } from "@/types";

const CATEGORY_RULES: Record<Category, string[]> = {
  Food: ["swiggy", "zomato", "restaurant", "cafe", "tea", "snack", "juice", "hotel", "food", "biryani", "pizza", "burger", "dine", "eatery", "dominos", "kfc", "mcdonalds"],
  Grocery: ["zepto", "blinkit", "instamart", "grocery", "mart", "store", "bigbasket", "grofer", "fresh", "dunzo"],
  Transport: ["uber", "ola", "metro", "fuel", "petrol", "diesel", "rapido", "cab", "auto", "bus", "irctc", "train", "bmrc"],
  Shopping: ["amazon", "flipkart", "myntra", "meesho", "nykaa", "store", "mall", "purchase", "shop"],
  Bills: ["electricity", "water", "gas", "broadband", "bill", "postpaid", "utility", "bescom", "mseb", "tpddl"],
  Recharge: ["recharge", "prepaid", "topup", "mobile", "airtel", "jio", "vi ", "bsnl"],
  Health: ["pharmacy", "hospital", "clinic", "medicine", "doctor", "health", "medplus", "apollo", "1mg"],
  Education: ["course", "college", "school", "book", "exam", "fees", "udemy", "coursera", "byju"],
  Entertainment: ["spotify", "netflix", "youtube", "prime video", "movie", "hotstar", "zee5", "sonyliv", "bookmyshow"],
  Subscription: ["subscription", "recurring", "autopay", "netflix", "spotify", "prime", "hotstar", "youtube premium"],
  Transfer: ["bank transfer", "self", "sent to", "imps", "neft", "upi transfer", "transfer", "friend"],
  Travel: ["flight", "irctc", "hotel booking", "trip", "makemytrip", "yatra", "oyo"],
  Salary: ["salary", "payroll", "stipend", "income", "employer"],
  Cashback: ["cashback", "reward", "scratch card", "bonus", "offer"],
  Refund: ["refund", "reversal", "chargeback", "return"],
  Rent: ["rent", "landlord", "pg ", "hostel"],
  EMI: ["emi", "loan installment", "equated", "creditcard emi", "hdfc emi"],
  Miscellaneous: [],
  Unknown: [],
};

export function detectCategory(text: string): Category {
  const hay = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_RULES) as [Category, string[]][]) {
    if (keywords.some((k) => hay.includes(k))) return category;
  }
  return "Unknown";
}
