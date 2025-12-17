// Currency configuration
export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
];

// showNairaSign: true = show ₦, false = show NGN (for PDF)
export const getCurrencySymbol = (code, showNairaSign = true) => {
    const currency = CURRENCIES.find(c => c.code === code);
    if (code === 'NGN') return showNairaSign ? '₦' : 'NGN';
    return currency ? currency.symbol : '$';
};

// showNairaSign: true = show ₦, false = show NGN (for PDF)
export const formatCurrency = (amount, currencyCode = 'USD', showNairaSign = true) => {
    const symbol = getCurrencySymbol(currencyCode, showNairaSign);
    // Use toLocaleString for comma separation
    return `${symbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
