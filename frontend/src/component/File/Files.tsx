import { File } from '../../type/entity'
import { Button, Spin, Table, TableProps, Tooltip } from 'antd'
import { translate } from '../../utils'
import { useLazyQuery } from '@apollo/client'
import { GET_FILES } from '../../gql/file'
import React, { useEffect, useState } from 'react'
import {
  FileAddFilled,
  FileExcelOutlined,
  FileImageOutlined,
  FileJpgOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { PageableRequest, PageableResponse } from '../../type/pagination'
import { DEFAULT_PAGE_SIZE } from '../../App.constant'
import { FileSelectorDialog } from './FileSelectorDialog'

export const Files = () => {
  const [query, {loading}] = useLazyQuery<PageableResponse<'filesFind', File>, PageableRequest>(GET_FILES)
  const [data, setData] = useState<File[]>([])
  const [total, setTotal] = useState<number>()
  const [openFileManager, setOpenFileManager] = useState<boolean>(false)

  const fetch = async (page: number, pageSize: number) => {
    const {data} = await query({
      variables: {
        request: {
          take: pageSize,
          skip: (page - 1) * pageSize,
        }
      }
    })
    setData(data?.filesFind.data ?? [])
    setTotal(data?.filesFind.count)
  }

  useEffect(() => {
    fetch(1, DEFAULT_PAGE_SIZE)
  }, [])

  const [files, setFiles] = useState<string[]>([/*'65ea1b138388f4768fc36d25', '660b0dc2bfb9328747468eea'*/])

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
        dataSource={data}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          onChange: fetch,
          total: total,
          pageSize: 10,
        }}
      />
    </Spin>

    <Button
      icon={<FileAddFilled/>}
      onClick={() => setOpenFileManager(true)}
    />
    <FileSelectorDialog
      open={openFileManager}
      onClose={() => setOpenFileManager(false)}
    />
  </>)
}

const fileMimeMapper: Record<string, React.ReactNode> = {
  'image/jpeg': <FileJpgOutlined style={{fontSize: 30}}/>,
  'image/png': <FileImageOutlined style={{fontSize: 30}}/>,
  'application/pdf': <FilePdfOutlined style={{fontSize: 30}}/>,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileExcelOutlined style={{fontSize: 30}}/>,
}