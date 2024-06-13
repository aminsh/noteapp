import { useLazyQuery, useMutation } from '@apollo/client'
import { GoogleDrivePageableResponse } from '../../type/pagination'
import { EXPORT, GET_GOOGLE_DRIVE_FILES } from '../../gql/file'
import React, { useEffect, useState } from 'react'
import { File } from '../../type/entity'
import { Button, Input, List, Space, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { FileItem } from './FilesSelector'

const END_OF_LIST = 'end-of-list'

export const GoogleDriveFilesSelector = () => {
  const [query, {loading}] = useLazyQuery<GoogleDrivePageableResponse, {
    request: {
      search?: string,
      nextPageToken?: string,
    }
  }>(GET_GOOGLE_DRIVE_FILES)
  const [ excuteExport, { loading: exporting, error } ] = useMutation<{ file: File }, {input: {fileId: string, mimeType: string}}>(EXPORT)
  const [nextPageToken, setNextPageToken] = useState<string>()
  const [files, setFiles] = useState<File[]>([])
  const [search, setSearch] = useState<string>('')

  const fetch = async () => {
    const {data} = await query({
      variables: {
        request: {
          nextPageToken,
          search,
        }
      }
    })
    setFiles([
      ...files,
      ...data?.googleDriveFind.data ?? [],
    ])
    setNextPageToken(data?.googleDriveFind.nextPageToken ?? END_OF_LIST)
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <Space
      direction='vertical'
      className='w-100'
    >
      <Input
        size='large'
        onChange={e => setSearch(e.target.value)}
        onKeyUp={e => e.key === 'Enter' && fetch()}
        prefix={<SearchOutlined/>}
      />
      <Spin spinning={loading}>
        <List<File>
          style={{overflow: 'auto', height: 700}}
          loadMore={
            <div
              style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
              }}
            >
              <Button onClick={fetch}>loading more</Button>
            </div>
          }
          itemLayout={'horizontal'}
          size='small'
          bordered
          dataSource={files}
          renderItem={(item) =>
            <FileItem
              file={item}
              checked={true}
              onCheckedChange={() => {
              }}
            />
          }
        />
      </Spin>
    </Space>
  )
}