import { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID, DEMO_USER_EMAIL } from "../lib/constants";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  // Upsert demo user
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      id: DEMO_USER_ID,
      name: "Demo User",
      email: DEMO_USER_EMAIL,
    },
  });

  console.log("Seeded user:", user.email);

  // Clear existing data
  await prisma.transaction.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.cashbackReward.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.walletBalance.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.subscription.deleteMany({ where: { userId: DEMO_USER_ID } });

  // Seed transactions
  const transactions = [
    { date: daysAgo(0), amount: 245, direction: "debit", rawDescription: "UPI-P2M-SWIGGYBLR-XX8234", normalizedMerchant: "Swiggy", sourceType: "UPI", category: "Food", confidence: 0.95, explanation: "Food order of ₹245 paid to Swiggy via UPI.", isSubscription: false },
    { date: daysAgo(1), amount: 129, direction: "debit", rawDescription: "Netflix subscription renewal", normalizedMerchant: "Netflix", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.98, explanation: "Recurring subscription payment of ₹129 to Netflix.", isSubscription: true },
    { date: daysAgo(1), amount: 350, direction: "debit", rawDescription: "UPI-P2M-UBER-INDIA-XX5621", normalizedMerchant: "Uber", sourceType: "UPI", category: "Transport", confidence: 0.92, explanation: "Transport payment of ₹350 to Uber via UPI.", isSubscription: false },
    { date: daysAgo(2), amount: 50000, direction: "credit", rawDescription: "NEFT-EMPLOYER-SALARY-MAY", normalizedMerchant: "Employer", sourceType: "BANK_TRANSFER", category: "Salary", confidence: 0.9, explanation: "Salary credit of ₹50000 received from Employer.", isSubscription: false },
    { date: daysAgo(2), amount: 890, direction: "debit", rawDescription: "UPI-P2M-ZOMATO-XX9012", normalizedMerchant: "Zomato", sourceType: "UPI", category: "Food", confidence: 0.95, explanation: "Food order of ₹890 paid to Zomato via UPI.", isSubscription: false },
    { date: daysAgo(3), amount: 399, direction: "debit", rawDescription: "AIRTEL-PREPAID-RECHARGE-9876543210", normalizedMerchant: "Airtel", sourceType: "UPI", category: "Recharge", confidence: 0.93, explanation: "Mobile/utility recharge of ₹399 via UPI.", isSubscription: false },
    { date: daysAgo(3), amount: 2500, direction: "debit", rawDescription: "UPI-P2P-9876543210@okaxis", normalizedMerchant: "Unknown Merchant", sourceType: "UPI", category: "Unknown", confidence: 0.35, explanation: "Paid ₹2500 to Unknown Merchant via UPI.", isSubscription: false },
    { date: daysAgo(4), amount: 1200, direction: "debit", rawDescription: "BIGBASKET-GROCERY-ORDER-99233", normalizedMerchant: "BigBasket", sourceType: "UPI", category: "Grocery", confidence: 0.9, explanation: "Paid ₹1200 to BigBasket via UPI.", isSubscription: false },
    { date: daysAgo(4), amount: 119, direction: "debit", rawDescription: "SPOTIFY-PREMIUM-INDIA", normalizedMerchant: "Spotify", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.97, explanation: "Recurring subscription payment of ₹119 to Spotify.", isSubscription: true },
    { date: daysAgo(5), amount: 75, direction: "debit", rawDescription: "UPI-P2M-TEA-STALL-98123@paytm", normalizedMerchant: "Tea Stall", sourceType: "UPI", category: "Food", confidence: 0.45, explanation: "Paid ₹75 to Tea Stall via UPI.", isSubscription: false },
    { date: daysAgo(5), amount: 500, direction: "debit", rawDescription: "UPI-P2P-FRIEND-TRANSFER-RAVI", normalizedMerchant: "Friend Transfer", sourceType: "UPI", category: "Transfer", confidence: 0.78, explanation: "Bank transfer of ₹500 sent via UPI.", isSubscription: false },
    { date: daysAgo(6), amount: 85, direction: "credit", rawDescription: "PHONEPE-CASHBACK-SWIGGY", normalizedMerchant: "PhonePe", sourceType: "CASHBACK", category: "Cashback", confidence: 0.9, explanation: "Cashback of ₹85 credited from PhonePe.", isSubscription: false, cashbackAmount: 85, cashbackStatus: "earned" },
    { date: daysAgo(7), amount: 3500, direction: "debit", rawDescription: "ELECTRICITY-BILL-BESCOM-BANGALORE", normalizedMerchant: "BESCOM", sourceType: "UPI", category: "Bills", confidence: 0.92, explanation: "Paid ₹3500 to BESCOM via UPI.", isSubscription: false },
    { date: daysAgo(7), amount: 199, direction: "debit", rawDescription: "JIO-PREPAID-RECHARGE", normalizedMerchant: "Jio", sourceType: "UPI", category: "Recharge", confidence: 0.95, explanation: "Mobile/utility recharge of ₹199 via UPI.", isSubscription: false },
    { date: daysAgo(8), amount: 450, direction: "debit", rawDescription: "RAPIDO-BIKE-TAXI-XX7823", normalizedMerchant: "Rapido", sourceType: "UPI", category: "Transport", confidence: 0.88, explanation: "Transport payment of ₹450 to Rapido via UPI.", isSubscription: false },
    { date: daysAgo(9), amount: 149, direction: "debit", rawDescription: "AMAZON-PRIME-SUBSCRIPTION", normalizedMerchant: "Amazon Prime", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.96, explanation: "Recurring subscription payment of ₹149 to Amazon Prime.", isSubscription: true },
    { date: daysAgo(10), amount: 1800, direction: "debit", rawDescription: "FLIPKART-ORDER-FK87362", normalizedMerchant: "Flipkart", sourceType: "CARD", category: "Shopping", confidence: 0.9, explanation: "Paid ₹1800 to Flipkart via Card.", isSubscription: false },
    { date: daysAgo(10), amount: 60, direction: "debit", rawDescription: "UPI-AUTORICKSHAW-7823@ybl", normalizedMerchant: "Auto Rickshaw", sourceType: "UPI", category: "Unknown", confidence: 0.38, explanation: "Paid ₹60 to Auto Rickshaw via UPI.", isSubscription: false },
    { date: daysAgo(11), amount: 15000, direction: "debit", rawDescription: "RENT-LANDLORD-TRANSFER-IMPS", normalizedMerchant: "Landlord", sourceType: "BANK_TRANSFER", category: "Rent", confidence: 0.85, explanation: "Paid ₹15000 to Landlord via BANK_TRANSFER.", isSubscription: false },
    { date: daysAgo(12), amount: 320, direction: "debit", rawDescription: "ZEPTO-GROCERY-DELIVERY", normalizedMerchant: "Zepto", sourceType: "UPI", category: "Grocery", confidence: 0.92, explanation: "Paid ₹320 to Zepto via UPI.", isSubscription: false },
    { date: daysAgo(13), amount: 99, direction: "debit", rawDescription: "HOTSTAR-SUBSCRIPTION-RENEWAL", normalizedMerchant: "Disney+ Hotstar", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.95, explanation: "Recurring subscription payment of ₹99 to Disney+ Hotstar.", isSubscription: true },
    { date: daysAgo(14), amount: 200, direction: "debit", rawDescription: "UPI-P2M-MEDPLUS-PHARMACY", normalizedMerchant: "Medplus", sourceType: "UPI", category: "Health", confidence: 0.88, explanation: "Paid ₹200 to Medplus via UPI.", isSubscription: false },
    { date: daysAgo(15), amount: 750, direction: "debit", rawDescription: "IRCTC-TRAIN-TICKET-BOOKING", normalizedMerchant: "IRCTC", sourceType: "UPI", category: "Travel", confidence: 0.94, explanation: "Paid ₹750 to IRCTC via UPI.", isSubscription: false },
    { date: daysAgo(16), amount: 55, direction: "debit", rawDescription: "UPI-P2M-83726@paytm", normalizedMerchant: "Unknown Merchant", sourceType: "UPI", category: "Unknown", confidence: 0.3, explanation: "Paid ₹55 to Unknown Merchant via UPI.", isSubscription: false },
    { date: daysAgo(17), amount: 5000, direction: "debit", rawDescription: "HDFC-CREDITCARD-EMI-MAY", normalizedMerchant: "HDFC Bank", sourceType: "CARD", category: "EMI", confidence: 0.85, explanation: "Paid ₹5000 to HDFC Bank via Card.", isSubscription: false },
    { date: daysAgo(18), amount: 180, direction: "debit", rawDescription: "SWIGGY-INSTAMART-GROCERY", normalizedMerchant: "Swiggy", sourceType: "UPI", category: "Grocery", confidence: 0.89, explanation: "Paid ₹180 to Swiggy via UPI.", isSubscription: false },
    { date: daysAgo(19), amount: 120, direction: "debit", rawDescription: "UPI-P2M-COFFEE-DAY-CAFE", normalizedMerchant: "Coffee Day", sourceType: "UPI", category: "Food", confidence: 0.8, explanation: "Food order of ₹120 paid to Coffee Day via UPI.", isSubscription: false },
    { date: daysAgo(20), amount: 50, direction: "credit", rawDescription: "AMAZON-PAY-CASHBACK", normalizedMerchant: "Amazon Pay", sourceType: "CASHBACK", category: "Cashback", confidence: 0.92, explanation: "Cashback of ₹50 credited from Amazon Pay.", isSubscription: false, cashbackAmount: 50, cashbackStatus: "earned" },
    { date: daysAgo(21), amount: 2200, direction: "debit", rawDescription: "NYKAA-BEAUTY-ORDER", normalizedMerchant: "Nykaa", sourceType: "CARD", category: "Shopping", confidence: 0.9, explanation: "Paid ₹2200 to Nykaa via Card.", isSubscription: false },
    { date: daysAgo(22), amount: 95, direction: "debit", rawDescription: "UPI-P2M-CANTEEN-89123@oksbi", normalizedMerchant: "Canteen", sourceType: "UPI", category: "Food", confidence: 0.5, explanation: "Paid ₹95 to Canteen via UPI.", isSubscription: false },
    { date: daysAgo(23), amount: 300, direction: "debit", rawDescription: "OLA-RIDE-BOOKING-XX3412", normalizedMerchant: "Ola", sourceType: "UPI", category: "Transport", confidence: 0.91, explanation: "Transport payment of ₹300 to Ola via UPI.", isSubscription: false },
    { date: daysAgo(24), amount: 85, direction: "debit", rawDescription: "UPI-METRO-CARD-RECHARGE-BMRC", normalizedMerchant: "Metro", sourceType: "UPI", category: "Transport", confidence: 0.87, explanation: "Transport payment of ₹85 to Metro via UPI.", isSubscription: false },
    { date: daysAgo(25), amount: 649, direction: "debit", rawDescription: "BLINKIT-GROCERY-DELIVERY", normalizedMerchant: "Blinkit", sourceType: "UPI", category: "Grocery", confidence: 0.92, explanation: "Paid ₹649 to Blinkit via UPI.", isSubscription: false },
    { date: daysAgo(26), amount: 70, direction: "debit", rawDescription: "UPI-P2M-67234@ybl", normalizedMerchant: "Unknown Merchant", sourceType: "UPI", category: "Unknown", confidence: 0.28, explanation: "Paid ₹70 to Unknown Merchant via UPI.", isSubscription: false },
    { date: daysAgo(27), amount: 1500, direction: "debit", rawDescription: "MYNTRA-FASHION-ORDER", normalizedMerchant: "Myntra", sourceType: "CARD", category: "Shopping", confidence: 0.91, explanation: "Paid ₹1500 to Myntra via Card.", isSubscription: false },
    { date: daysAgo(28), amount: 400, direction: "debit", rawDescription: "DOMINOS-PIZZA-ORDER-ONLINE", normalizedMerchant: "Dominos Pizza", sourceType: "CARD", category: "Food", confidence: 0.88, explanation: "Food order of ₹400 paid to Dominos Pizza via Card.", isSubscription: false },
    { date: daysAgo(30), amount: 50000, direction: "credit", rawDescription: "NEFT-SALARY-APRIL", normalizedMerchant: "Employer", sourceType: "BANK_TRANSFER", category: "Salary", confidence: 0.9, explanation: "Salary credit of ₹50000 received from Employer.", isSubscription: false },
    { date: daysAgo(32), amount: 499, direction: "debit", rawDescription: "YOUTUBE-PREMIUM-SUBSCRIPTION", normalizedMerchant: "YouTube Premium", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.96, explanation: "Recurring subscription payment of ₹499 to YouTube Premium.", isSubscription: true },
    { date: daysAgo(35), amount: 250, direction: "debit", rawDescription: "UPI-P2M-DUNZO-DELIVERY", normalizedMerchant: "Dunzo", sourceType: "UPI", category: "Grocery", confidence: 0.85, explanation: "Paid ₹250 to Dunzo via UPI.", isSubscription: false },
    { date: daysAgo(40), amount: 3200, direction: "debit", rawDescription: "AMAZON-ORDER-ELECTRONICS", normalizedMerchant: "Amazon Pay", sourceType: "CARD", category: "Shopping", confidence: 0.91, explanation: "Paid ₹3200 to Amazon Pay via Card.", isSubscription: false },
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: { userId: DEMO_USER_ID, ...t },
    });
  }
  console.log(`Seeded ${transactions.length} transactions`);

  // Seed wallets
  const wallets = [
    { walletName: "Paytm Wallet", balance: 1250 },
    { walletName: "PhonePe Wallet", balance: 320 },
    { walletName: "Amazon Pay", balance: 840 },
    { walletName: "Google Pay Balance", balance: 0 },
    { walletName: "MobiKwik", balance: 150 },
  ];
  for (const w of wallets) {
    await prisma.walletBalance.create({ data: { userId: DEMO_USER_ID, ...w } });
  }
  console.log(`Seeded ${wallets.length} wallets`);

  // Seed rewards
  const rewards = [
    { sourceName: "PhonePe", amount: 85, status: "earned", earnedAt: daysAgo(6), expiresAt: daysAgo(-20), description: "Swiggy order cashback" },
    { sourceName: "Amazon Pay", amount: 50, status: "earned", earnedAt: daysAgo(20), expiresAt: daysAgo(-10), description: "Shopping reward" },
    { sourceName: "Paytm", amount: 30, status: "pending", earnedAt: daysAgo(3), expiresAt: daysAgo(-25), description: "Pending cashback for recharge" },
    { sourceName: "Google Pay", amount: 120, status: "claimed", earnedAt: daysAgo(45), expiresAt: null, description: "UPI reward claimed" },
    { sourceName: "PhonePe", amount: 200, status: "earned", earnedAt: daysAgo(2), expiresAt: daysAgo(-5), description: "Flash sale cashback - expiring soon!" },
    { sourceName: "Amazon Pay", amount: 75, status: "pending", earnedAt: daysAgo(1), expiresAt: daysAgo(-30), description: "Prime subscription reward" },
    { sourceName: "Paytm", amount: 15, status: "earned", earnedAt: daysAgo(10), expiresAt: daysAgo(-3), description: "Mini cashback - expiring in 3 days!" },
  ];
  for (const r of rewards) {
    await prisma.cashbackReward.create({ data: { userId: DEMO_USER_ID, ...r } });
  }
  console.log(`Seeded ${rewards.length} rewards`);

  // Seed subscriptions
  const subs = [
    { merchant: "Netflix", amount: 149, cycle: "monthly", nextDueDate: daysAgo(-15), sourceType: "SUBSCRIPTION", active: true },
    { merchant: "Spotify", amount: 119, cycle: "monthly", nextDueDate: daysAgo(-12), sourceType: "SUBSCRIPTION", active: true },
    { merchant: "Amazon Prime", amount: 149, cycle: "monthly", nextDueDate: daysAgo(-8), sourceType: "SUBSCRIPTION", active: true },
    { merchant: "Disney+ Hotstar", amount: 99, cycle: "monthly", nextDueDate: daysAgo(-7), sourceType: "SUBSCRIPTION", active: true },
    { merchant: "YouTube Premium", amount: 499, cycle: "monthly", nextDueDate: daysAgo(-1), sourceType: "SUBSCRIPTION", active: true },
  ];
  for (const s of subs) {
    await prisma.subscription.create({ data: { userId: DEMO_USER_ID, ...s } });
  }
  console.log(`Seeded ${subs.length} subscriptions`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
