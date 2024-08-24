import { Note } from '../../type/entity'
import { Button, Input, message, Pagination, Row, Space, Spin } from 'antd'
import { confirm, notify, translate } from '../../utils'
import React, { useState } from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { NoteRemoveMutationDocument, NotesQueryDocument, NoteSubscription } from '../../gql/note'
import { NoteShareDialog } from './NoteShareDialog'
import { NoteCard } from './NoteCard'
import { NotePreviewDialog } from './NotePreview'
import { Page, PageableRequest, PageableResponse } from '../../type/pagination'
import { DEFAULT_PAGE_SIZE } from '../../App.constant'
import { NoteEntry } from './NoteEntry'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

export const NoteList = ({params}:{params?: any}) => {
  const [page, setPage] = useState<Page>({pageSize: DEFAULT_PAGE_SIZE, page: 1})
  const [search, setSearch] = useState<string>()
  const {data, loading, refetch} = useQuery<PageableResponse<'notesFind', Note>, PageableRequest<{
    search?: string
  }>>(NotesQueryDocument, {
    variables: {
      request: {
        take: page.pageSize,
        skip: (page.page - 1) * page.pageSize,
        search,
      },
    }
  })
  useSubscription(NoteSubscription, {
    onData: () => refetch(),
  })

  const [remove] = useMutation(NoteRemoveMutationDocument)
  const [idBeingShared, setIdBeingShared] = useState<string | null>()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note>()
  const [messageApi, contextHolder] = message.useMessage()
  const [openEntry, setOpenEntry] = useState<boolean>(false)

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
    await refetch()
  }

  const handleGetPublicLink = async (id: string) => {
    const host = window.location.host
    const link = `${host}/content/${id}`
    await navigator.clipboard.writeText(link)
    messageApi.info(translate('link_copied'))
  }

  return (<>
    <Spin spinning={loading}>
      <Row className='d-flex justify-content-center'>
        <Input
          value={search}
          style={{width: '30%'}}
          size='large'
          onChange={e => setSearch(e.currentTarget.value)}
          prefix={<SearchOutlined/>}
        />
      </Row>

      <Row>
        <Button
          type='primary'
          onClick={() => {
            setSelectedNote(undefined)
            setOpenEntry(true)
          }}
          icon={<PlusOutlined/>}
        >
          {translate('new')}
        </Button>
      </Row>

      <Row className='mt-3'>
        <Space wrap>
          {data?.notesFind.data.map(note => (
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
        className='d-flex justify-content-center'
        pageSize={page.pageSize}
        onChange={(page, pageSize) => setPage({page, pageSize})}
        total={data?.notesFind.count}
      />
    </Spin>

    <NoteEntry
      open={openEntry}
      onClose={() => setOpenEntry(false)}
      entity={selectedNote}
      onComplete={()=> {/*refetch*/}}
    />

    <NoteShareDialog
      onClose={() => setIdBeingShared(null)}
      noteId={idBeingShared}
      onChange={()=> {/*refetch*/}}
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