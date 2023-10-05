import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query NoteQuery {
      NoteFind {
        id
        title
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

export const REMOVE_NOTE = gql`
  mutation ExecuteNoteRemove($noteId: String!) {
    NoteRemove(noteId: $noteId)
  }
`
