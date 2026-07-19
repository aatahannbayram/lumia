export function formatPrice(priceMinor: number, locale: string) {
  const amount = priceMinor / 100
  return new Intl.NumberFormat(`${locale}-u-nu-latn`, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount)
}
