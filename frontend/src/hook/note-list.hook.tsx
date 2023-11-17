import { useDispatch } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { Note } from '../type/entity'
import { GET_ALL_NOTES } from '../gql/note'
import { setNotes } from '../store/redux/reducer'

export const useNoteList = () => {
  const [ getNotes, { loading } ] = useLazyQuery<{ NoteFind: Note[], SharedNoteFind: Note[] }>(GET_ALL_NOTES)
  const dispatch = useDispatch()

  const fetch = async () => {
    const { data } = await getNotes()
    const myNotes = data?.NoteFind || []
    const sharedNotes = data?.SharedNoteFind || []

    dispatch(
      setNotes({
        myNotes,
        sharedNotes
      })
    )
  }

  return {
    fetch,
    loading
  }
}
