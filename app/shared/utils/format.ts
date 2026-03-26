export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString()
}
