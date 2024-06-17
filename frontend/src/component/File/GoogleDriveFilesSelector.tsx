import { useLazyQuery, useMutation } from '@apollo/client'
import { GoogleDrivePageableResponse } from '../../type/pagination'
import { CloneGoogleDriveFileMutationDocument, GoogleDriveFilesQueryDocument } from '../../gql/file'
import React, { useEffect, useState } from 'react'
import { File } from '../../type/entity'
import { Button, Input, List, Space, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { FileTypeIcon } from './FileTypeIcon'
import { translate } from '../../utils'

export type GoogleDriveFilesSelectorProps = {
  onChange: (file?: File) => void
}

export const GoogleDriveFilesSelector = ({onChange}: GoogleDriveFilesSelectorProps) => {
  const [query, {loading}] = useLazyQuery<GoogleDrivePageableResponse, {
    request: {
      search?: string,
      nextPageToken?: string,
    }
  }>(GoogleDriveFilesQueryDocument)
  const [clone, {loading: cloning}] = useMutation<{ googleDriveClone: File }, {
    id: string
  }>(CloneGoogleDriveFileMutationDocument)
  const [nextPageToken, setNextPageToken] = useState<string>()
  const [files, setFiles] = useState<File[]>([])
  const [search, setSearch] = useState<string>('')
  const [idBeingExecuted, setIdBeingExecuted] = useState<string | null>()
  const [isEndOfList, setIsEndOfList] = useState<boolean>(false)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    if (isEndOfList)
      return

    const {data} = await query({
      variables: {
        request: {
          nextPageToken,
          search,
        },
      },
    })
    setFiles([
      ...files,
      ...data?.googleDriveFind.data ?? [],
    ])
    setNextPageToken(data?.googleDriveFind.nextPageToken)

    if (!data?.googleDriveFind.nextPageToken)
      setIsEndOfList(true)
  }

  const handleClone = async (file: File) => {
    setIdBeingExecuted(file.id)

    try {
      const {data} = await clone({
        variables: {
          id: file.id,
        },
      })

      onChange(data?.googleDriveClone)
    } finally {
      setIdBeingExecuted(null)
    }
  }

  return (
    <Space
      direction="vertical"
      className="w-100"
    >
      <Input
        size="large"
        onChange={e => {
          setSearch(e.target.value)
          setIsEndOfList(false)
          setNextPageToken(undefined)
          setFiles([])
        }}
        onKeyUp={e => e.key === 'Enter' && fetch()}
        prefix={<SearchOutlined/>}
      />

      <div
        style={{maxHeight: 500, overflow: 'auto'}}
      >
        <Spin
          spinning={loading}
        >
          <List<File>
            loadMore={
              <>
                {
                  !isEndOfList && !loading
                    ? <div
                      style={{
                        textAlign: 'center',
                        marginTop: 12,
                        height: 32,
                        lineHeight: '32px',
                      }}
                    >
                      <Button onClick={fetch}>{translate('load_more')}</Button>
                    </div>
                    : ''
                }
              </>
            }
            itemLayout={'horizontal'}
            size="small"
            bordered
            dataSource={files}
            renderItem={file =>
              <List.Item
                actions={[
                  <Button
                    loading={cloning && idBeingExecuted === file.id}
                    onClick={() => handleClone(file)}>
                    {translate('select')}
                  </Button>,
                ]}
              >
                <Space>
                  <FileTypeIcon
                    file={file}
                    size={30}
                  />
                  {file.originalName}
                </Space>
              </List.Item>
            }
          />
        </Spin>
      </div>
    </Space>
  )
}