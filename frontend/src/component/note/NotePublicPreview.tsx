import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Note } from '../../type/entity'
import { NotePreview } from './NotePreview'
import { Spin } from 'antd'
import { PageableRequest, PageableResponse } from '../../type/pagination'
import { NotesQueryDocument } from '../../gql/note'

export const NotePublicPreview = () => {
  const {id} = useParams<{ id: string }>()
  const {data, loading} = useQuery<PageableResponse<'notesFind', Note>, PageableRequest<{id: string}>>(NotesQueryDocument, {
    variables: {
      request: {
        take: 1,
        skip: 0,
        id: id ?? '',
      }
    }
  })

  return (
    <Spin spinning={loading}>
      <NotePreview
        note={data?.notesFind.data[0]}
      />
    </Spin>
  )
}