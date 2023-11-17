import { Button, Collapse, CollapseProps, List, Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { Note, NoteState } from '../../type/entity'
import { Link, useNavigate } from 'react-router-dom'
import { EditOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import { useNoteList } from '../../hook/note-list.hook'
import { useSelector } from 'react-redux'
import { translate } from '../../utils'
import { NoteShareDialog } from './NoteShareDialog'

export const NotesMenu = () => {
  const [ noteId, setNoteId ] = useState<string>()
  const { fetch, loading } = useNoteList()
  const { noteList } = useSelector(state => state) as { noteList: NoteState }
  const navigate = useNavigate()

  const menus: CollapseProps['items'] = [
    {
      key: 'myNotes',
      label: translate('my', 'notes'),
      children: <List<Note>
        size='small'
        dataSource={ noteList.myNotes }
        renderItem={ item => (
          <List.Item key={ item.id } actions={ [
            <Button
              type='text'
              shape='circle'
              icon={ <UserAddOutlined/> }
              onClick={ () => setNoteId(item.id) }
            />,

            <Button
              type='text'
              shape='circle'
              icon={ <EditOutlined/> }
              onClick={ () => navigate(`/notes/${ item.id }/edit`) }
            />,
          ] }>
            { item.title }
          </List.Item>
        ) }
      />,
    },
    {
      key: 'sharedWithMe',
      label: translate('shared_with_me'),
      children: <List<Note>
        size='small'
        dataSource={ noteList.sharedNotes }
        renderItem={ item => (
          <List.Item key={ item.id } actions={ [

          ] }>
            { item.title }
          </List.Item>
        ) }
      />,
    },
  ]


  useEffect(() => {
    fetch()
  }, [])

  return (
    <Spin spinning={ loading }>
      <div className='p-2'>
        <Tooltip title='New'>
          <Link to={ '/notes/new' }>
            <Button
              icon={ <PlusOutlined/> }
            />
          </Link>
        </Tooltip>
      </div>

      <Collapse
        bordered={ false }
        style={ { background: 'transparent' } }
        items={ menus }
        defaultActiveKey={ [ 'myNotes' ] }
      />

      <NoteShareDialog
        onClose={ () => setNoteId(undefined) }
        noteId={ noteId }
      />
    </Spin>
  )
}
