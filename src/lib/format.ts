import { CURRENCY } from '../data/proposal'

export const formatMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 }).format(n)

export const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ')
