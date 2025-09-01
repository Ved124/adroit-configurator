
export const currencySymbol = (code: string) => ({
  USD: "$",
  EUR: "€",
  INR: "₹",
  GBP: "£",
}[code] ?? code)

export const formatMoney = (value: number, currency: string) => {
  const symbol = currencySymbol(currency)
  return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}
