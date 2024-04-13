import { useContext, useEffect, useState } from 'react'
import { SocketContext, SocketContextProps } from '../socket'
import { useSelector } from 'react-redux'
import { Note, NoteState } from '../type/entity'
import { useNoteList } from './note-list.hook'

export const useNoteSync = () => {
  const {socket} = useContext<SocketContextProps>(SocketContext)
  const [syncing, setSyncing] = useState<boolean>(false)
  const {noteList} = useSelector(state => state) as { noteList: NoteState }
  const [current, setCurrent] = useState<Note>()
  const {fetch} = useNoteList()
  const [currentId, setCurrentId] = useState<string>()

  const handleChange = () => {
    socket?.on('note:changed', async () => {
      fetch()
      console.log('[NOTE:CHANGED]')
    })
  }

  useEffect(() => {
    handleChange()
  }, [])

  useEffect(() => {
    const note = [
      ...noteList.myNotes,
      ...noteList.sharedNotes,
    ].find(n => n.id === currentId)
    setCurrent(note)
  }, [currentId, noteList])

  return {
    syncing,
    current,
    setCurrent: setCurrentId,
    update: async (id: string, dto: any) => {
      setSyncing(true)

      try {
        socket?.emitWithAck('request', {
          message: 'noteUpdateRequest',
          body: {id, ...dto}
        })
      } finally {
        setSyncing(false)
      }
    },
  }
}