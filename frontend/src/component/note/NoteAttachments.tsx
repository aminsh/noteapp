import { Button, Space } from 'antd'
import { FileAddOutlined } from '@ant-design/icons'
import { FormField } from '../../type/form'
import { useState } from 'react'
import { FileSelectorDialog } from '../File/FileSelectorDialog'
import { translate } from '../../utils'
import { File } from '../../type/entity'
import { FilesDisplay } from '../File/FilesDisplay'

export const NoteAttachments = ({value, onChange}: FormField<File[]>) => {
  const [openFileSelector, setOpenFileSelector] = useState<boolean>(false)

  return (
    <>
      <Space direction="vertical">
        <Button
          key='open-file-selector'
          type='primary'
          icon={<FileAddOutlined/>}
          onClick={() => setOpenFileSelector(true)}
        >
          {translate('select', 'files')}
        </Button>

        <FilesDisplay value={value} onChange={onChange} />
      </Space>

      <FileSelectorDialog
        value={value}
        onChange={value => onChange!(value)}
        open={openFileSelector}
        onClose={() => setOpenFileSelector(false)}
      />
    </>
  )
}
