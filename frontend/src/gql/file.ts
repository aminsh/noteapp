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

export const GET_GOOGLE_DRIVE_FILES = gql`
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

export const EXPORT = gql`
    mutation Export($input: GoogleDriveExportDto!) {
        googleDriveExport(input: $input) {
            id
            originalName
        }
    }
`