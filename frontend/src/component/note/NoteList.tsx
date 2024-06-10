import { Note } from '../../type/entity'
import { message, Pagination, Space, Spin } from 'antd'
import { confirm, notify, translate } from '../../utils'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { NoteRemoveMutationDocument, NotesQueryDocument } from '../../gql/note'
import { NoteShareDialog } from './NoteShareDialog'
import { NoteCard } from './NoteCard'
import { NotePreviewDialog } from './NotePreview'
import { Page, PageableRequest, PageableResponse } from '../../type/pagination'
import { DEFAULT_PAGE_SIZE } from '../../App.constant'

export const NoteList = () => {
  const [find, {loading}] = useLazyQuery<PageableResponse<'notesFind', Note>, PageableRequest<{search?: string}>>(NotesQueryDocument)
  const [page, setPage] = useState<Page>({pageSize: DEFAULT_PAGE_SIZE, page: 1, total: 0})
  const [data, setData] = useState<Note[]>([])
  const [search, setSearch] = useState<string>()

  const [remove, {loading: removing}] = useMutation(NoteRemoveMutationDocument)

  const [idBeingShared, setIdBeingShared] = useState<string | null>()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note>()
  const [messageApi,contextHolder] = message.useMessage()

  const fetch = async (input: Partial<Page>) => {
    const {data} = await find({
      variables: {
        request: {
          take: page.pageSize,
          skip: (page.page - 1) * page.pageSize,
          search,
        }
      }
    })

    setData(data?.notesFind.data ?? [])
    setPage({
      ...page,
      total: data?.notesFind.count ?? 0,
    })
  }

  const handleRemove = async (id: string) => {
    const result = await confirm(translate('remove_confirmation_message'))

    if (!result)
      return

    await remove({
      variables: {
        noteId: id,
      },
    })

    notify.success(
      translate('note'),
      translate('remove_success_message'),
    )
    await fetch(page)
  }

  const handleGetPublicLink = async (id: string) => {
    const host = window.location.host
    const link = `${host}/content/${id}`
    await navigator.clipboard.writeText(link)
    messageApi.info(translate('link_copied'))
  }

  useEffect(() => {
    fetch(page)
  }, [])

  return (<>
    <Spin spinning={loading}>
      <Space wrap>
        {data?.map(note => (
          <NoteCard
            note={note}
            share={() => setIdBeingShared(note.id)}
            remove={() => handleRemove(note.id)}
            preview={() => {
              setShowPreview(true)
              setSelectedNote(note)
            }}
            getPublicLink={() => handleGetPublicLink(note.id)}
          />
        ))}
      </Space>
      <Pagination
        className='d-flex justify-content-center'
        pageSize={page.pageSize}
        onChange={(page, pageSize) => fetch({page, pageSize})}
        total={page.total}
      />
    </Spin>

    <NoteShareDialog
      onClose={() => setIdBeingShared(null)}
      noteId={idBeingShared}
      onChange={()=> fetch(page)}
    />

    <NotePreviewDialog
      note={selectedNote}
      open={showPreview}
      onClose={() => {
        setShowPreview(false)
        setSelectedNote(undefined)
      }}
    />
    {contextHolder}
  </>)

}
