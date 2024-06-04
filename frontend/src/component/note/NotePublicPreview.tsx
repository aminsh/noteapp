import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_NOTE_BY_ID } from '../../gql/note'
import { Note } from '../../type/entity'
import { NotePreview } from './NotePreview'
import { Spin } from 'antd'

export const NotePublicPreview = () => {
  const {id} = useParams<{ id: string }>()
  const {data, loading} = useQuery<{ NoteById: Note }, { noteId: string }>(GET_NOTE_BY_ID, {
    variables: {
      noteId: id ?? '',
    }
  })

  return (
    <Spin spinning={loading}>
      <NotePreview
        note={data?.NoteById}
      />
    </Spin>
  )
}