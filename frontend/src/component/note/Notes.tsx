import { Note, NoteState } from '../../type/entity'
import { Avatar, Badge, Button, Space, Spin, Table, TableProps, Tooltip } from 'antd'
import { confirm, dateTimeDisplay, notify, translate } from '../../utils'
import { useSelector } from 'react-redux'
import { DeleteOutlined, EditOutlined, PaperClipOutlined, UserOutlined } from '@ant-design/icons'
import { useNoteList } from '../../hook/note-list.hook'
import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { REMOVE_NOTE } from '../../gql/note'
import { NoteShareDialog } from './NoteShareDialog'

export const Notes = ({type}: { type: 'MyNotes' | 'SharedNotes' }) => {
  const {fetch, loading} = useNoteList()
  const [remove, {loading: removing}] = useMutation(REMOVE_NOTE)
  const {noteList} = useSelector(state => state) as { noteList: NoteState }
  const navigate = useNavigate()
  const dataSource = type === 'MyNotes'
    ? noteList.myNotes
    : noteList.sharedNotes
  const [idBeingRemoved, setIdBeingRemoved] = useState<string | null>()
  const [idBeingShared, setIdBeingShared] = useState<string | null>()

  const handleRemove = async (id: string) => {
    const result = await confirm(translate('remove_confirmation_message'))

    if (!result)
      return

    setIdBeingRemoved(id)

    try {
      await remove({
        variables: {
          noteId: id,
        },
      })

      notify.success(
        translate('note'),
        translate('remove_success_message'),
      )
    } finally {
      setIdBeingRemoved(null)
    }

    await fetch()
  }

  const columns: TableProps<Note>['columns'] = [
    {
      title: translate('updated_at'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: value => dateTimeDisplay(value),
    },
    {
      title: translate('title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: translate('shared'),
      dataIndex: 'shared',
      key: 'shared',
      render: (_, {id, shared}) => (
        shared.length &&
        <Button
          onClick={() => setIdBeingShared(id)}
          shape="circle"
          type="text">
          <Avatar.Group maxCount={3}>
            {shared.map((it, index) =>
              <Avatar
                icon={<UserOutlined/>}
                style={{background: color[index]}}
              >
                {it.user.name?.substring(0, 1)}
              </Avatar>,
            )}
          </Avatar.Group>
        </Button>
      ),
    },
    {
      title: translate('attachments'),
      dataIndex: 'attachments',
      key: 'attachments',
      render: (_, {attachments}) => (
        attachments.length &&
        <Badge
          count={attachments.length}
        >
          <Avatar
            shape="square"
            icon={<PaperClipOutlined/>}
          />
        </Badge>
      ),
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, {id}) => (<Space>
        <Tooltip title={translate('edit')}>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined/>}
            onClick={() => navigate(`/notes/${id}/edit`)}
          />
        </Tooltip>

        <Tooltip title={translate('remove')}>
          <Button
            disabled={removing}
            loading={removing && idBeingRemoved === id}
            danger
            type="text"
            shape="circle"
            icon={<DeleteOutlined/>}
            onClick={() => handleRemove(id)}
          />
        </Tooltip>
      </Space>),
    },
  ]

  useLayoutEffect(() => {
    fetch()
  }, [])

  return (<>
    <Spin spinning={loading}>
      <Table
        dataSource={dataSource}
        columns={columns}
      />
    </Spin>

    <NoteShareDialog
      onClose={() => setIdBeingShared(null)}
      noteId={idBeingShared}
      onChange={fetch}
    />
  </>)

}

const color = [
  'rgb(45, 183, 245)',
  'hsl(102, 53%, 61%)',
  'hwb(205 6% 9%)',
]