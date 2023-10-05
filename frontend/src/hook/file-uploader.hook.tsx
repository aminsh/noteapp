import { UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import { memory } from '../utils'
import { Token } from '../type/auth'
import { AUTHENTICATION_TOKEN } from '../App.constant'
import { File } from '../type/entity'

export const useFileUploader = () => {
  const upload = async (file: UploadFile): Promise<File> => {
    const token = memory.get<Token>(AUTHENTICATION_TOKEN)
    const headers = new Headers()
    headers.append('Authorization', `${ token?.token_type } ${ token?.access_token }`)
    const data = new FormData()
    data.append('file', file as RcFile)

    const response = await fetch(
      `${ process.env.REACT_APP_API_BASE_URL }/files/upload`,
      {
        method: 'POST',
        headers,
        body: data
      })

    const responseText = await response.text()
    return JSON.parse(responseText) as File
  }

  return {
    upload
  }
}
