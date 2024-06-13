import { Note } from '../../type/entity'
import { Modal, Space } from 'antd'
import sanitizeHtml from 'sanitize-html'

export type NotePreviewProps = {
  note?: Note
  open: boolean
  onClose: () => void
}

export const NotePreviewDialog = ({note, open, onClose}: NotePreviewProps) => {
  return(
    <Modal
      closable
      open={open}
      onCancel={onClose}
      cancelButtonProps={{hidden: true}}
      okButtonProps={{hidden: true}}
      width='70%'
    >
      <NotePreview note={note}/>
    </Modal>
  )
}

export const NotePreview = ({note}: {note?: Note}) => {
  return (
    <Space direction='vertical'>
      <h1>{note?.title}</h1>
      <SanitizedHTML html={ note?.content } />
    </Space>
  )
}

const SanitizedHTML = ({ html }: { html?: string }) => {
  const clean = sanitizeHtml(html ?? '')
  return (
    <div
      dangerouslySetInnerHTML={{__html: clean}}
    />
  )
}