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

export const GoogleDriveFilesQueryDocument = gql`
    query GetGoogleDriveFiles($request: GoogleDriveFindRequest!) {
        googleDriveFind(request: $request) {
            data {
                id
                originalName
                type
                mimeType
                url
            }
            nextPageToken
        }
    }
`

export const CloneGoogleDriveFileMutationDocument = gql`
    mutation clone($id: String!) {
        googleDriveClone(id: $id) {
            id
            filename
            originalName
            type
            mimeType
        }
    } 
`