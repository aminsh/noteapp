import { useNavigate, useParams } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Note } from '../../type/entity'
import { CREATE_NOTE, GET_NOTE_BY_ID, REMOVE_NOTE, UPDATE_NOTE } from '../../gql/note'
import { Button, Card, Form, Input, Space, Spin } from 'antd'
import { useEffect } from 'react'
import { DeleteOutlined, SaveFilled } from '@ant-design/icons';
import { useNoteList } from '../../hook/note-list.hook';
import { notify, translate, confirm } from '../../utils';
import { NoteEditorControl } from './NoteEditorControl';

const { useForm } = Form

export const EditNote = () => {
  const [ form ] = useForm<Note | undefined>()
  const { id } = useParams<{ id: string }>()
  const { fetch: noteListRefresh } = useNoteList()
  const navigate = useNavigate()
  const [ getNote, { loading } ] = useLazyQuery<{ NoteById: Note }>(GET_NOTE_BY_ID, {
    variables: {
      noteId: id
    }
  })

  const [ create, { loading: creating } ] = useMutation<{ NoteCreate: Note }>(CREATE_NOTE)
  const [ update, { loading: updating } ] = useMutation(UPDATE_NOTE)
  const [ executeRemove, { loading: removing } ] = useMutation(REMOVE_NOTE)

  const fetch = async () => {
    if (!id) {
      form.setFieldsValue({
        title: '',
        content: ''
      })

      return
    }

    const result = await getNote()
    form.setFieldsValue(result.data?.NoteById)
  }

  const save = async () => {
    const dto = form.getFieldsValue()

    if (id)
      await update({
        variables: {
          noteId: id,
          noteUpdate: dto
        }
      })
    else {
      const result = await create({
        variables: {
          noteCreate: dto
        }
      })

      navigate(`/notes/${ result.data?.NoteCreate.id }/edit`)
    }

    notify.success(translate('note'), translate('note', 'save_success_message'))

    await noteListRefresh()
  }

  const remove = async () => {
    const result = await confirm(translate('remove_confirmation_message'))

    if (!result)
      return

    await executeRemove({
      variables: {
        noteId: id
      }
    })

    notify.success(translate('note'), translate('remove_success_message'))
    await noteListRefresh()
    navigate('/')
  }

  useEffect(() => {
    fetch()
  }, [ id ])

  return (
    <Form form={ form } layout='vertical'>
      <Spin spinning={ loading }>
        <Card className='max-height'>
          <Form.Item>
            <Space>
              <Button
                onClick={ save }
                type="primary"
                icon={ <SaveFilled/> }
                loading={ creating || updating }
              >
                { translate('save') }
              </Button>

              <Button
                onClick={ remove }
                type='default'
                danger
                icon={ <DeleteOutlined/> }
                loading={ removing }
              >
                { translate('remove') }
              </Button>
            </Space>
          </Form.Item>

          <Form.Item
            label={ translate('title') }
            name='title'
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name='content'
          >
            <NoteEditorControl/>
          </Form.Item>
        </Card>
      </Spin>
    </Form>
  )
}
