import { File, FileType } from '../../type/entity'
import React from 'react'
import { FileImageOutlined, FileJpgOutlined } from '@ant-design/icons'
import { FileIcon } from './FileIcon'
import SvgPdf from '../../asset/pdf.svg'
import SvgXls from '../../asset/xls.svg'
import { Image } from 'antd'
import { resolvePathFile } from '../../utils'

const fileTypeMapperFactory = (size: number): Record<FileType, React.ReactNode> => {
  return {
    [FileType.JPG]: <FileJpgOutlined style={{fontSize: size}}/>,
    [FileType.PNG]: <FileImageOutlined style={{fontSize: size}}/>,
    [FileType.PDF]: <FileIcon size={size} src={SvgPdf} alt="pdf"/>,
    [FileType.XLS]: <FileIcon size={size} src={SvgXls} alt="xls"/>,
    [FileType.DOC]: <></>,
    [FileType.TXT]: <></>,
  }
}

export const FileTypeIcon = ({file, size}: { file: File, size: number }) => {
  const fileTypeMapper = fileTypeMapperFactory(size)

  return (<>
    {
      [FileType.JPG, FileType.PNG].includes(file.type)
        ? <Image
          width={size} height={size}
          src={resolvePathFile(file.filename)}
        />
        : fileTypeMapper[file.type]
    }
  </>)
}