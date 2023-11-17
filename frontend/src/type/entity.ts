import React from 'react'

export interface User {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
}

export interface Note {
  id: string
  title: string
  content: string
  attachments: File[]
  shared: NoteShare[]
}

export interface NoteMenuItem {
  label: React.ReactNode,
  key: React.Key,
}

export interface NoteState {
  myNotes: Note[]
  sharedNotes: Note[]
}

export interface NoteShare {
  user: User
  access: NoteAccess
}

export interface File {
  id: string
  createdBy: User
  filename: string
  originalName: string
  mimeType: string
  size: number
}

export enum NoteAccess {
  ViewOnly = 'ViewOnly',
  AllowEdit = 'AllowEdit'
}
