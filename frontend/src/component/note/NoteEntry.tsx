import { useNavigate, useParams } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Note } from '../../type/entity'
import { CREATE_NOTE, GET_NOTE_BY_ID, REMOVE_NOTE } from '../../gql/note'
import { Badge, Card, Form, Input, Spin } from 'antd'
import { useEffect } from 'react'
import { useNoteList } from '../../hook/note-list.hook'
import { confirm, notify, translate } from '../../utils'
import { NoteEditorControl } from './NoteEditorControl'
import { NoteAttachments } from './NoteAttachments'
import { useNoteSync } from '../../hook/note-sync.hook'

const {useForm} = Form

export const NoteEntry = () => {
  const [form] = useForm<Note | undefined>()
  const {id} = useParams<{ id: string }>()
  const {syncing, update, current, setCurrent} = useNoteSync()

  const handleSync = (data: any) => {
    const dto = {
      ...data,
      attachments: data?.attachments.map((e: any) => e.id),
    }
    return update(id as string, dto)
  }

  useEffect(() => {
    if (!id)
      return
    setCurrent(id)
  }, [id])

  useEffect(() => {
    form.setFieldsValue(current)
  }, [current])

  return (
    <Form
      onFinish={handleSync}
      onFieldsChange={form.submit}
      form={form}
      layout='vertical'
    >
      <Card>
        <Badge
          color='green'
          text={syncing
            ? translate('syncing', '...')
            : translate('synced')}
        />

        <Form.Item
          label={translate('title')}
          name='title'
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name='content'
        >
          <NoteEditorControl/>
        </Form.Item>

        <Form.Item
          name='attachments'
        >
          <NoteAttachments/>
        </Form.Item>
      </Card>
    </Form>
  )
}
