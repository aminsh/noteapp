import { FileSelectorProps, FilesSelector } from './FilesSelector'
import { useEffect, useState } from 'react'
import { Modal, Space } from 'antd'
import { translate } from '../../utils'
import { FileOutlined } from '@ant-design/icons'

export type FileSelectorDialogProps = FileSelectorProps & {
  open: boolean
  onClose: () => void
}

export const FileSelectorDialog = ({value, onChange, onClose, open}: FileSelectorDialogProps) => {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    setFiles(value ?? [])
  }, [value])

  const handleOK = () => {
    onChange?.(files)
    onClose()
  }

  return (
    <Modal
      title={
        <Space>
          <FileOutlined/>
          {translate('file_manager')}
        </Space>
      }
      closable={false}
      open={open}
      onOk={handleOK}
      onCancel={onClose}
    >
      <FilesSelector
        value={files}
        onChange={setFiles}
      />
    </Modal>
  )
}