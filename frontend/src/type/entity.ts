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
}

export interface NoteMenuItem {
  label: React.ReactNode,
  key: React.Key,
}

export interface NoteState {
  noteMenuItems: NoteMenuItem[]
}

export interface File {
  id: string
  createdBy: User
  filename: string
  originalName: string
  mimeType: string
  size: number
}
