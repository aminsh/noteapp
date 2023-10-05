import { Button, Upload, UploadFile } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { readUrlAsync, resolvePathFile, translate } from '../../utils'
import { FormField } from '../../type/form'
import { File } from '../../type/entity'
import { useEffect, useState } from 'react'
import { useFileUploader } from '../../hook/file-uploader.hook'

export const NoteAttachments = ({ value, onChange }: FormField<File[]>) => {
  const fileUploader = useFileUploader()
  const [ files, setFiles ] = useState<UploadFile[]>([])

  const upload = async (file: UploadFile) => {
    const result = await fileUploader.upload(file)
    set([ ...files, mapToUploadFile(result) ])
  }

  const mapToUploadFile = (source: File): UploadFile => ({
    uid: source.id,
    name: source.originalName,
    fileName: source.filename,
    size: source.size,
    status: 'done',
    url: resolvePathFile(source.filename)
  })

  const mapToFile = (source: UploadFile): File => ({
    id : source.uid,
    originalName : source.name,
    filename : source.fileName || '',
    size : source.size || 0,
  } as File)

  const set = (files: UploadFile[]) => {
    setFiles(files)
    onChange!(
      files
        .filter(f => f.status === 'done')
        .map(mapToFile)
    )
  }

  useEffect(() => {
    setFiles(
      (value || []).map<UploadFile>(mapToUploadFile)
    )
  }, [ value ])

  return (
    <Upload
      className='upload-list-inline'
      beforeUpload={ async (file: UploadFile) => {
        file.url = await readUrlAsync(file)
        set([ ...files, file ])
        return false
      } }
      listType='picture'
      fileList={ files }
      onChange={ async ({ file }) => {
        if (!file.status)
          await upload(file)
      } }
      onRemove={ file => {
        set((files || []).filter(f => f.uid !== file.uid))
      } }
    >
      <Button icon={ <UploadOutlined/> }>
        { translate('upload') }
      </Button>
    </Upload>
  )
}
