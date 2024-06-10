import { gql } from '@apollo/client';

export const NotesQueryDocument = gql`
    query NotesFindQuery($request: NoteFindRequest!) {
        notesFind(request: $request) {
            data {
                updatedAt,
                id
                title
                content
                attachments {
                    id
                    filename
                    originalName
                    size
                    mimeType
                }
                shared {
                    user {
                        name
                    }
                }
            }
            count
        }
    }
`

export const NoteRemoveMutationDocument = gql`
    mutation ExecuteNoteRemove($noteId: String!) {
        noteRemove(noteId: $noteId)
    }
`

export const GET_MY_NOTES = gql`
    query GetMyNotes {
        NoteFind {
            id
            title
            shared {
                user {
                    name
                }
            }
            attachments {
                id
            }
        }
    }
`

export const GET_NOTE_BY_ID = gql`
    query NoteQuery($noteId: String!) {
        NoteById(noteId: $noteId) {
            id
            title
            content
            attachments {
                id
                filename
                originalName
                size
                mimeType
            }
        }
    }
`

export const GET_NOTE_SHARED_BY_ID = gql`
    query GetNoteSharedById($noteId: String!) {
        NoteById(noteId: $noteId) {
            shared {
                user {
                    id
                }
                access
            }
        }
    }
`

export const CREATE_NOTE = gql`
    mutation ExecuteNoteCreate($noteCreate: NoteDto!) {
        NoteCreate(noteCreate: $noteCreate) {
            id
        }
    }
`

export const UPDATE_NOTE = gql`
    mutation ExecuteNoteUpdate($noteId: String!,$noteUpdate: NoteDto!) {
        NoteUpdate(noteId: $noteId,noteUpdate: $noteUpdate)
    }
`



export const SHARE_NOTE = gql`
    mutation ExecuteNoteShare($noteId: String!, $noteShare: [NoteShareDTO!]!) {
        NoteShare(noteId: $noteId, noteShare: $noteShare)
    }
`
