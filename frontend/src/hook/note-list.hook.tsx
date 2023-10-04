import { useDispatch } from 'react-redux'
import { useLazyQuery } from '@apollo/client';
import { Note } from '../type/entity';
import { GET_NOTES } from '../gql/note';
import { setNotes } from '../store/redux/reducer';
import { Link } from 'react-router-dom';

export const useNoteList = () => {
  const [ getNotes, { loading } ] = useLazyQuery<{ NoteFind: Note[] }>(GET_NOTES)
  const dispatch = useDispatch()

  const fetch = async () => {
    const result = await getNotes()
    dispatch(setNotes({
      noteMenuItems: (result.data?.NoteFind || []).map((note, index) => ({
        label: <Link to={ `/notes/${ note.id }/edit` } style={ { textDecoration: 'none' } }>{ note.title }</Link>,
        key: index.toString()
      }))
    }))
  }

  return {
    fetch,
    loading
  }
}
