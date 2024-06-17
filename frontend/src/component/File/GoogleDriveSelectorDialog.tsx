import { Modal, Space } from 'antd'
import { translate } from '../../utils'
import { FileOutlined } from '@ant-design/icons'
import { File } from '../../type/entity'
import { GoogleDriveFilesSelector } from './GoogleDriveFilesSelector'
import googleDriveIcon from '../../asset/google_drive.png'
import { FileIcon } from './FileIcon'

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
          <FileIcon src={googleDriveIcon} size={32} alt='googleDrive' />
          {translate('google_drive')}
        </Space>
      }
      closable
      open={open}
      onOk={handleOK}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <GoogleDriveFilesSelector onChange={file => {
        file && onComplete(file)
        onClose()
      }}/>
    </Modal>
  )
}