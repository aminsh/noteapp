import Icon from '@ant-design/icons'

export const FileIcon = ({src, alt, size}: FileIconProps) => {
  return <Icon component={() => <img src={src} alt={alt} style={{width: size || 16}}/>}/>
}

export type FileIconProps = {
  src: string | undefined
  alt: string | undefined
  size?: number
}

/*https://www.veryicon.com/icons/file-type/file-type-icon-2/*/
