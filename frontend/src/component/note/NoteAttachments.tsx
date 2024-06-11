import { Button, List, Space } from 'antd'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
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

       {/* <List<File>
          key='file-list'
          dataSource={value}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  type="text"
                  shape="circle"
                  danger
                  icon={<DeleteOutlined/>}
                  onClick={() => onChange!((value ?? []).filter(it => it.id !== item.id))}
                />,
              ]}
            >
              {item.id}
            </List.Item>
          )}
        />*/}
        <FilesDisplay value={value} onChange={onChange} />
      </Space>

      <FileSelectorDialog
        value={value?.map(it => it.id)}
        onChange={value => onChange!(value.map(it => ({id: it} as File)))}
        open={openFileSelector}
        onClose={() => setOpenFileSelector(false)}
      />
    </>
  )
}
