import { gql } from '@apollo/client'

export const FILE_LIST = gql`
  query GetFiles {
    FileFind {
      id
      originalName
      mimeType
      size
    }
  }
`