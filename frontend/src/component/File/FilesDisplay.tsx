import { File } from '../../type/entity'
import { Button, Card, Col, Row, Space, Spin } from 'antd'
import { FileTypeIcon } from './FileTypeIcon'
import { DeleteOutlined } from '@ant-design/icons'
import { FormField } from '../../type/form'

export const FilesDisplay = ({value, onChange}: FormField<File[]>) => {
  return (
    <Space>
      {value?.map(file => <FileCart file={file}/>)}
    </Space>
  )
}

const FileCart = ({file}: { file: File }) => {
  return (
    <Card
      style={{width: 200}}
      /*actions={[
        <Button
          size="small"
          type="text"
          shape="circle"
          danger
          icon={<DeleteOutlined/>}
        />
      ]}*/
    >
      <Card.Meta
        avatar={<FileTypeIcon file={file} size={30}/>}
        title={file.originalName}
      />
    </Card>
  )
}
