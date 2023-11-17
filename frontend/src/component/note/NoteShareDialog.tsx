import { Button, Form, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { NoteAccess, NoteShare } from '../../type/entity'
import { useLazyQuery, useMutation } from '@apollo/client'
import { notify, translate } from '../../utils';
import { GET_NOTE_SHARED_BY_ID, SHARE_NOTE } from '../../gql/note';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { NoteShareUser } from './NoteShareUser';

const { useForm } = Form

export const NoteShareDialog = ({ onClose, noteId }: NoteShareProps) => {
  const [ form ] = useForm<{ shared: NoteShareDTO[] }>()
  const [ load, { loading: loadingShared } ] = useLazyQuery<{ NoteById: { shared: NoteShare[] } }, { noteId: string }>(GET_NOTE_SHARED_BY_ID)
  const [ share, { loading: savingShared } ] = useMutation<void, { noteId: string, noteShare: NoteShareDTO[] }>(SHARE_NOTE,
    {
      onCompleted: () => {
        notify.success(
          translate('note', 'share'),
          translate('save_success_message')
        )
        onClose!()
      },
    }
  )

  useEffect(() => {
    fetch()
  }, [ noteId ])

  const fetch = async () => {
    form.setFieldsValue({
      shared: []
    })

    if (!noteId)
      return

    const { data } = await load({
      variables: {
        noteId
      }
    })

    const shared = data?.NoteById?.shared || []

    form.setFieldsValue({
      shared: shared.map(({ user, access }) => ({ userId: user.id, access }))
    })
  }
  const save = ({ shared }: { shared: NoteShareDTO[] }) => {
    return share({
      variables: {
        noteId: noteId || '',
        noteShare: shared.map(sh => ({ userId: sh.userId, access: sh.access })),
      }
    })
  }

  return (
    <Modal
      title={ translate('share', 'note') }
      closable={ false }
      open={ !!noteId }
      onOk={ form.submit }
      onCancel={ onClose }
      confirmLoading={ savingShared }
    >
      <Spin spinning={ loadingShared }>
        <Form
          onFinish={ save }
          form={ form }>
          <Form.List name='shared'>
            { (fields, { add, remove }) => (
              <>
                <Tooltip title={ translate('add') }>
                  <Button
                    icon={ <PlusOutlined/> }
                    onClick={ () => add({ access: NoteAccess.ViewOnly }) }
                  />
                </Tooltip>

                <table className='table'>
                  <thead>
                  <tr>
                    <th style={ { width: '60%' } }>{ translate('user') }</th>
                    <th style={ { width: '30%' } }>{ translate('access') }</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  { fields.map((field, index) => (
                    <tr>
                      <td>
                        <Form.Item name={ [ index, 'userId' ] }
                                   rules={ [ { required: true, message: 'user is required' } ] }>
                          <NoteShareUser/>
                        </Form.Item>
                      </td>

                      <td>
                        <Form.Item name={ [ index, 'access' ] }>
                          <Select
                            options={
                              Object.entries(NoteAccess).map(([ key, value ]) => ({ value, label: key }))
                            }
                          />
                        </Form.Item>
                      </td>

                      <td>
                        <Tooltip title={ translate('remove') }>
                          <Button
                            onClick={ () => remove(index) }
                            icon={ <DeleteOutlined/> }
                            shape='circle'
                            type='text'
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  )) }
                  </tbody>
                </table>
              </>
            ) }
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  )
}

interface NoteShareProps {
  onClose: () => void
  noteId: string | undefined
}

interface NoteShareDTO {
  userId: string
  access: NoteAccess
}
