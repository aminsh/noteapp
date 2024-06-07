import { File, FileType } from '../../type/entity'
import { useLazyQuery } from '@apollo/client'
import { PageableRequest, PageableResponse } from '../../type/pagination'
import { GET_FILES } from '../../gql/file'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '../../App.constant'
import { Button, Checkbox, Image, Input, List, Pagination, Space, Spin, Upload, UploadFile } from 'antd'
import {
  FileExcelOutlined,
  FileImageOutlined,
  FileJpgOutlined,
  FilePdfOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { resolvePathFile, translate } from '../../utils'
import { useFileUploader } from '../../hook/file-uploader.hook'
import SvgPdf from '../../asset/pdf.svg'
import SvgXls from '../../asset/xls.svg'
import { FileIcon } from './FileIcon'

export type FileSelectorProps = {
  value?: string[]
  onChange?: (value: string[]) => void
}

export type PageConfiguration = {
  page: number
  pageSize: number
}

export const FilesSelector = ({value, onChange}: FileSelectorProps) => {
  const [query, {loading}] = useLazyQuery<PageableResponse<'filesFind', File>, PageableRequest<{
    search?: string,
    ids?: string[],
    notEqualIds?: string[],
  }>>(GET_FILES)
  const [files, setFiles] = useState<File[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [total, setTotal] = useState<number>()
  const [pageConfig, setPageConfig] = useState<PageConfiguration>({page: 1, pageSize: DEFAULT_PAGE_SIZE})
  const [search, setSearch] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)
  const fileUploader = useFileUploader()

  const fetch = async ({page, pageSize}: PageConfiguration) => {
    setPageConfig({
      page,
      pageSize,
    })
    const {data} = await query({
      variables: {
        request: {
          take: pageSize,
          skip: (page - 1) * pageSize,
          notEqualIds: value ?? [],
          search,
        }
      }
    })
    setFiles(data?.filesFind.data ?? [])
    setTotal(data?.filesFind.count ?? 0)
  }

  const fetchSelected = async () => {
    if (!value?.length)
      return setSelectedFiles([])

    const {data} = await query({
      variables: {
        request: {
          take: 100,
          skip: 0,
          ids: value ?? [],
        }
      }
    })
    setSelectedFiles(data?.filesFind.data ?? [])
  }

  useEffect(() => {
    fetch(pageConfig)
    fetchSelected()
  }, [value])

  useEffect(() => {
    fetch(pageConfig)
  }, [search])

  const checkedChangeHandler = async (file: File, checked: boolean) => {
    const selectedItems = checked
      ? [...selectedFiles, file]
      : selectedFiles.filter(f => f.id !== file.id)

    onChange!(selectedItems.map(it => it.id))
  }

  const handleUpload = async (file: UploadFile) => {
    setUploading(true)

    try {
      const uploadedFile = await fileUploader.upload(file)
      await checkedChangeHandler(uploadedFile, true)
      await fetch(pageConfig)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Space
      direction='vertical'
      className='w-100'>

      <Upload
        beforeUpload={async (file: UploadFile) => {
          debugger
          return false
        }}
        onChange={({file}) => {
          if (!file.status)
            return handleUpload(file)
        }}
        showUploadList={false}
      >
        <Button
          loading={uploading}
          icon={<UploadOutlined/>}
          type='primary'
          size='large'
        >
          {translate('upload')}
        </Button>
      </Upload>

      <Input
        size='large'
        onChange={e => setSearch(e.target.value)}
        prefix={<SearchOutlined/>}
      />
      {
        value?.length
          ? <List<File>
            itemLayout={'horizontal'}
            size='small'
            bordered
            dataSource={selectedFiles}
            renderItem={(item) =>
              <FileItem
                file={item}
                checked={false}
                onCheckedChange={checkedChangeHandler}
              />
            }
          />
          : ''
      }
      <Spin spinning={loading}>
        <List<File>
          itemLayout={'horizontal'}
          size='small'
          bordered
          dataSource={files}
          renderItem={(item) =>
            <FileItem
              file={item}
              checked={true}
              onCheckedChange={checkedChangeHandler}
            />
          }
        />
      </Spin>
      <Pagination
        className='d-flex justify-content-center'
        pageSize={DEFAULT_PAGE_SIZE}
        onChange={(page, pageSize) => fetch({page, pageSize})}
        total={total}
      />
    </Space>
  )
}

const fileMimeMapper: Record<FileType, React.ReactNode> = {
  [FileType.JPG]: <FileJpgOutlined style={{fontSize: 30}}/>,
  [FileType.PNG]: <FileImageOutlined style={{fontSize: 30}}/>,
  [FileType.PDF]: <FileIcon size={30} src={SvgPdf} alt='pdf'/>,
  [FileType.XLS]: <FileIcon size={30} src={SvgXls} alt='xls'/>,
  [FileType.DOC]: <></>,
  [FileType.TXT]: <></>,
}

const FileTypeIcon = ({file}: { file: File }) => {
  return (<>
    {
      [FileType.JPG, FileType.PNG].includes(file.type)
        ? <Image
          width={30} height={30}
          src={resolvePathFile(file.filename)}
        />
        : fileMimeMapper[file.type]
    }
  </>)
}

const FileItem = ({file, onCheckedChange, checked}: {
  file: File,
  onCheckedChange: (file: File, checked: boolean) => void,
  checked: boolean
}) => {
  return <List.Item>
    <Space>
      <Checkbox
        checked={!checked}
        onChange={() => onCheckedChange(file, checked)}
      />
      <FileTypeIcon file={file}/>
      {file.originalName}
    </Space>
  </List.Item>
}