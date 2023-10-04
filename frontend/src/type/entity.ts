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
}

export interface NoteMenuItem {
  label: React.ReactNode,
  key: React.Key,
}

export interface NoteState {
  noteMenuItems: NoteMenuItem[]
}
