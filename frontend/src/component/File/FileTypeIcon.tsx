import { File, FileType } from '../../type/entity'
import React from 'react'
import { FileImageOutlined, FileJpgOutlined } from '@ant-design/icons'
import { FileIcon } from './FileIcon'
import SvgPdf from '../../asset/pdf.svg'
import SvgXls from '../../asset/xls.svg'
import SvgDoc from '../../asset/docx.svg'
import SvgTxt from '../../asset/txt.svg'
import { Image } from 'antd'
import { resolvePathFile } from '../../utils'
import * as docxPreview from 'docx-preview'

const fileTypeMapperFactory = (size: number, file?: File): Record<FileType, React.ReactNode> => {
  return {
    [FileType.JPG]: <FileJpgOutlined style={{fontSize: size}}/>,
    [FileType.PNG]: <FileImageOutlined style={{fontSize: size}}/>,
    [FileType.PDF]: <FileIcon size={size} src={SvgPdf} alt="pdf"/>,
    [FileType.XLS]: <FileIcon size={size} src={SvgXls} alt="xls"/>,
    [FileType.DOC]: <DocIcon size={size} file={file}/>,
    [FileType.TXT]: <FileIcon size={size} src={SvgTxt} alt="txt"/>,
  }
}

export const FileTypeIcon = ({file, size}: { file: File, size: number }) => {
  const fileTypeMapper = fileTypeMapperFactory(size, file)

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

export const DocIcon = ({ file, size }: { file?: File, size: number }) => {
  const handleClick = () => {
    if(!file)
      return

    fetch(resolvePathFile(file.filename))
      .then(async res => {
        const blob = await res.blob()

        await docxPreview.renderAsync(
          blob,
          // @ts-ignore
          document.getElementById('docx-container'),
        )
      })
  }
  return(
    <>
      <Image
        width={35}
        src={SvgDoc}
        preview={{
          destroyOnClose: true,
          imageRender: () => {
            handleClick()
            return <div id='docx-container'></div>
          },
          toolbarRender: () => null,
        }}
      />
    </>
  )
}