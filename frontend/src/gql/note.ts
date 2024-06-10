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

export const NoteCreateMutationDocument = gql`
    mutation CreateNote($input: NoteDto!) {
        noteCreate(input: $input) {
            id
        }
    }
`

export const NoteUpdateMutationDocument = gql`
    mutation updateNote($id: String!,$input: NoteDto!) {
        noteUpdate(id: $id, input: $input)
    }
`

export const NoteRemoveMutationDocument = gql`
    mutation RemoveNote($noteId: String!) {
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







export const SHARE_NOTE = gql`
    mutation ExecuteNoteShare($noteId: String!, $noteShare: [NoteShareDTO!]!) {
        NoteShare(noteId: $noteId, noteShare: $noteShare)
    }
`
