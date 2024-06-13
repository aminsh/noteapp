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
                    type
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

export const NoteShareMutationDocument = gql`
    mutation ShareNote($id: String!, $input: [NoteShareDTO!]!) {
        noteShare(id: $id, input: $input)
    }
`

export const NoteQueryShareUsersDocument = gql`
    query GetShareUsers($request: NoteFindRequest!) {
        notesFind(request: $request) {
            data {
                shared {
                    user {
                        id
                    }
                    access
                }
            }
        }
    }
`










