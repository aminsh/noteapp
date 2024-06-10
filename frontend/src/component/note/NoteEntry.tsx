import { Note } from '../../type/entity'
import { Form, Input, Modal, Space, Spin } from 'antd'
import { useEffect } from 'react'
import { notify, translate } from '../../utils'
import { NoteEditorControl } from './NoteEditorControl'
import { NoteAttachments } from './NoteAttachments'
import { useLazyQuery, useMutation } from '@apollo/client'
import { PageableRequest, PageableResponse } from '../../type/pagination'
import { NoteCreateMutationDocument, NotesQueryDocument, NoteUpdateMutationDocument } from '../../gql/note'
import { SaveOutlined } from '@ant-design/icons'

const {useForm} = Form

export type NoteEntryProps = {
  id?: string
  open?: boolean
  onClose?: () => void
}

export const NoteEntry = ({onClose, open, id}: NoteEntryProps) => {
  const [form] = useForm<Note>()
  const [find, {loading}] = useLazyQuery<PageableResponse<'notesFind', Note>, PageableRequest<{
    id: string
  }>>(NotesQueryDocument, {
    variables: {
      request: {
        skip: 0,
        take: 1,
        id: id ?? '',
      },
    },
  })
  const [create, {loading: creating}] = useMutation<void, { dto: any }>(NoteCreateMutationDocument)
  const [update, {loading: updating}] = useMutation<void, { dto: any }>(NoteUpdateMutationDocument)

  const fetch = async () => {
    let entity: Note = {
      id: '',
      title: '',
      content: '',
      attachments: [],
      shared: [],
    }

    if (!id) {
      const {data} = await find({
        variables: {
          request: {
            take: 1,
            skip: 0,
            id: id ?? '',
          },
        },
      })

      entity = (data?.notesFind.data ?? [])[0]
    }

    form.setFieldsValue(entity)
  }

  useEffect(() => {
    fetch()
  }, [id])

  const handleSave = async (data: Note) => {
    const dto = {
      title: data.title,
      content: data.content,
      attachments: data.attachments?.map(at => at.id),
    }

    id
      ? await update({
        variables: {dto},
      })
      : await create({
        variables: {dto},
      })

    notify.success(
      translate('note'),
      translate('save_success_message'),
    )

    onClose!()
  }

  return (
    <Modal
      title={translate(id ? 'edit' : 'new', 'note')}
      open={open}
      okText={<Space>
        <SaveOutlined/>
        {translate('save')}
      </Space>}
      onCancel={onClose}
      confirmLoading={creating || updating}
      width={700}
    >
      <Spin spinning={loading}>
        <Form
          onFinish={handleSave}
          onFieldsChange={form.submit}
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={translate('title')}
            name="title"
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="content"
          >
            <NoteEditorControl/>
          </Form.Item>

          <Form.Item
            name="attachments"
          >
            <NoteAttachments/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}
