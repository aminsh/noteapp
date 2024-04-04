import moment from 'moment'

export const defaultDateTimeFormat = 'YYYY-MM-DD h:mm:ss a'

export const dateTimeDisplay = (date: Date | undefined, format: string = defaultDateTimeFormat) => {
  if (!date)
    return ''
  return moment(date).format(format)
}