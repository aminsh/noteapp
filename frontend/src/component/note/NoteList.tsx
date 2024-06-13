import { Note } from '../../type/entity'
import { Button, Input, message, Pagination, Row, Space, Spin } from 'antd'
import { confirm, notify, translate } from '../../utils'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { NoteRemoveMutationDocument, NotesQueryDocument } from '../../gql/note'
import { NoteShareDialog } from './NoteShareDialog'
import { NoteCard } from './NoteCard'
import { NotePreviewDialog } from './NotePreview'
import { Page, PageableRequest, PageableResponse } from '../../type/pagination'
import { DEFAULT_PAGE_SIZE } from '../../App.constant'
import { NoteEntry } from './NoteEntry'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

export const NoteList = () => {
  const [find, {loading}] = useLazyQuery<PageableResponse<'notesFind', Note>, PageableRequest<{
    search?: string
  }>>(NotesQueryDocument)
  const [page, setPage] = useState<Page>({pageSize: DEFAULT_PAGE_SIZE, page: 1, total: 0})
  const [data, setData] = useState<Note[]>([])
  const [search, setSearch] = useState<string>()
  const [remove] = useMutation(NoteRemoveMutationDocument)
  const [idBeingShared, setIdBeingShared] = useState<string | null>()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note>()
  const [messageApi, contextHolder] = message.useMessage()
  const [openEntry, setOpenEntry] = useState<boolean>(false)

  const fetch = async (page: Pick<Page, 'page' | 'pageSize'>) => {
    const {data} = await find({
      variables: {
        request: {
          take: page.pageSize,
          skip: (page.page - 1) * page.pageSize,
          search,
        },
      },
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
      <Row className="d-flex justify-content-center">
        <Input
          style={{width: '30%'}}
          size="large"
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetch(page)}
          prefix={<SearchOutlined/>}
        />
      </Row>

      <Row>
        <Button
          type="primary"
          onClick={() => {
            setSelectedNote(undefined)
            setOpenEntry(true)
          }}
          icon={<PlusOutlined/>}
        >
          {translate('new')}
        </Button>
      </Row>

      <Row className="mt-3">
        <Space wrap>
          {data?.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              edit={() => {
                setSelectedNote(note)
                setOpenEntry(true)
              }}
              share={() => setIdBeingShared(note.id)}
              remove={() => handleRemove(note.id)}
              preview={() => {
                setSelectedNote(note)
                setShowPreview(true)
              }}
              getPublicLink={() => handleGetPublicLink(note.id)}
            />
          ))}
        </Space>
      </Row>

      <Pagination
        className="d-flex justify-content-center"
        pageSize={page.pageSize}
        onChange={(page, pageSize) => fetch({page, pageSize})}
        total={page.total}
      />
    </Spin>

    <NoteEntry
      open={openEntry}
      onClose={() => setOpenEntry(false)}
      entity={selectedNote}
      onComplete={() => fetch(page)}
    />

    <NoteShareDialog
      onClose={() => setIdBeingShared(null)}
      noteId={idBeingShared}
      onChange={() => fetch(page)}
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