import { File } from '../../type/entity'
import { Button, List } from 'antd'
import { FileTypeIcon } from './FileTypeIcon'
import { DeleteOutlined } from '@ant-design/icons'
import { FormField } from '../../type/form'

export const FilesDisplay = ({value, onChange}: FormField<File[]>) => {
  const handleRemove = (file: File) => {
    onChange!((value || []).filter(it => it.id !== file.id))
  }

  return (
    <List
      itemLayout='horizontal'
      size='small'
      dataSource={value}
      bordered
      renderItem={(file: File) => (
        <List.Item>
          <div className='d-flex flex-row w-100'>
            <div className='w-25'>
              <FileTypeIcon file={file} size={40}/>
            </div>

            <div className='w-75'>
              {file.originalName}
            </div>

            <div className='d-flex float-end align-items-center'>
              <Button
                size='small'
                type='text'
                shape='circle'
                danger
                icon={<DeleteOutlined/>}
                onClick={() => handleRemove(file)}
              />
            </div>
          </div>

        </List.Item>
      )}
    />
  )
}

