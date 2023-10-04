import { Button, Menu, Spin, Tooltip } from 'antd'
import { useEffect } from 'react'
import { NoteState } from '../../type/entity'
import { Link } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import { useNoteList } from '../../hook/note-list.hook';
import { useSelector } from 'react-redux';

export const NotesMenu = () => {
  const { fetch, loading } = useNoteList()
  const { noteList } = useSelector(state => state) as { noteList: NoteState }

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
      <Menu
        style={ { height: '100vh' } }
        defaultOpenKeys={ [ 'sub1' ] }
        mode="inline"
        inlineCollapsed={ false }
        items={ noteList.noteMenuItems }
      />
    </Spin>
  )
}
