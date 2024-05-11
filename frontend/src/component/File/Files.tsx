import { File } from '../../type/entity'
import { Spin, Table, TableProps, Tooltip } from 'antd'
import { translate } from '../../utils'
import { useQuery } from '@apollo/client'
import { FILE_LIST } from '../../gql/file'
import React from 'react'
import { FileExcelOutlined, FileImageOutlined, FileJpgOutlined, FilePdfOutlined } from '@ant-design/icons'

export const Files = () => {
  const {data, loading} = useQuery<{FileFind: File[]}>(FILE_LIST)

  const columns: TableProps<File>['columns'] = [
    {
      title: translate('mime_type'),
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: value => (
        <Tooltip title={value}>
          {fileMimeMapper[value]}
        </Tooltip>
      ),
      width: 100,
      className: 'text-center',
    },
    {
      title: translate('file_name'),
      dataIndex: 'originalName',
      key: 'originalName',
    },
  ]

  return (<>
    <Spin spinning={loading}>
      <Table
        dataSource={data?.FileFind}
        columns={columns}
      />
    </Spin>
  </>)
}

const fileMimeMapper: Record<string, React.ReactNode> = {
  'image/jpeg': <FileJpgOutlined style={{fontSize: 30}}/>,
  'image/png': <FileImageOutlined style={{fontSize: 30}}/>,
  'application/pdf': <FilePdfOutlined style={{fontSize: 30}}/>,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileExcelOutlined style={{fontSize: 30}}/>,
}