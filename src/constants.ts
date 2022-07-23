import { DateRangePickerValue } from '@tremor/react'

export const baseUrl = process.env.PUBLIC_URL ? `https://${process.env.PUBLIC_URL}` : 'http://localhost:3000'

export const url = `${baseUrl}/api/trpc`

export const DEFAULT_START_DATE_FILTER = () => {
  return new Date(new Date().setDate(new Date().getDate() - 30))
}

export const DEFAULT_END_DATE_FILTER = () => {
  return new Date()
}

export const DEFAULT_DATE_FILTER = () => {
  return [DEFAULT_START_DATE_FILTER(), DEFAULT_END_DATE_FILTER()] as DateRangePickerValue
}
