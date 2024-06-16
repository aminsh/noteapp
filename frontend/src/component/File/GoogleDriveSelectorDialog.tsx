import { useState } from 'react'
import { Modal, Space } from 'antd'
import { translate } from '../../utils'
import { FileOutlined } from '@ant-design/icons'
import { File } from '../../type/entity'
import { GoogleDriveFilesSelector } from './GoogleDriveFilesSelector'

export type GoogleDriveSelectorDialogProps = {
  open: boolean
  onClose: () => void
  onComplete: (file: File) => void
}

export const GoogleDriveSelectorDialog = ({onClose, open, onComplete}: GoogleDriveSelectorDialogProps) => {
  const handleOK = () => {

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
      <GoogleDriveFilesSelector onChange={file => {
        file && onComplete(file)
        onClose()
      }}/>
    </Modal>
  )
}