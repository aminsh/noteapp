import { gql } from '@apollo/client'

export const GET_FILES = gql`
    query GetFiles($request: FileFindRequest!) {
        filesFind(request: $request) {
            data {
                id
                originalName
                filename
                mimeType
                type
            }
            count
        }
    }
`