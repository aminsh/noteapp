import { RcFile } from 'antd/es/upload'
import { UploadFile } from 'antd'

export const readUrlAsync = (file: RcFile | File | UploadFile): Promise<string> => {
  return new Promise<string>(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file as File)
    reader.onloadend = () => resolve(reader.result as string)
  })
}

export const resolvePathFile = (fileName: string) => `${ process.env.REACT_APP_API_BASE_URL }/files/${ fileName }`
