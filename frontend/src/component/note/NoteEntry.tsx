import { Note } from '../../type/entity'
import { Form, Input, Modal, Space } from 'antd'
import { useEffect } from 'react'
import { notify, translate } from '../../utils'
import { NoteEditorControl } from './NoteEditorControl'
import { NoteAttachments } from './NoteAttachments'
import { useMutation } from '@apollo/client'
import { NoteCreateMutationDocument, NoteUpdateMutationDocument } from '../../gql/note'
import { SaveOutlined } from '@ant-design/icons'

const {useForm} = Form

export type NoteEntryProps = {
  entity?: Note
  open?: boolean
  onClose?: () => void
  onComplete?: () => void
}

export const NoteEntry = ({open, entity, onClose, onComplete}: NoteEntryProps) => {
  const [form] = useForm<Note>()
  const [create, {loading: creating}] = useMutation<void, { input: any }>(NoteCreateMutationDocument)
  const [update, {loading: updating}] = useMutation<void, { input: any }>(NoteUpdateMutationDocument)

  useEffect(() => {
    form.setFieldsValue(entity ?? {
      id: '',
      title: '',
      content: '',
      attachments: [],
      shared: [],
    })
  }, [entity])

  const handleSave = async (data: Note) => {
    const input = {
      title: data.title,
      content: data.content,
      attachments: data.attachments?.map(at => at.id),
    }

    entity
      ? await update({
        variables: {input},
      })
      : await create({
        variables: {input},
      })

    notify.success(
      translate('note'),
      translate('save_success_message'),
    )

    onComplete!()
    onClose!()
  }

  return (
    <Modal
      title={translate(entity ? 'edit' : 'new', 'note')}
      open={open}
      onOk={form.submit}
      okText={<Space>
        <SaveOutlined/>
        {translate('save')}
      </Space>}
      onCancel={onClose}
      confirmLoading={creating || updating}
      width={700}
    >
      <Form
        onFinish={handleSave}
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
    </Modal>
  )
}
