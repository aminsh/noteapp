import * as md5 from 'md5'

export const hash = (value: string) => md5(value)
