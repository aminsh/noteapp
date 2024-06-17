import * as fs from 'fs'
import { join } from 'path'
import * as Stream from 'node:stream'

export type WriteReadableArgs = {
  data: Stream
  fileName: string
}

export const writeReadableStream = ({data, fileName}: WriteReadableArgs): Promise<void> => {
  return new Promise((resolve, reject) => {
    let buf = new Buffer(0)

    data.on('data', chunk => {
      buf = Buffer.concat([buf, chunk])
    })

    data.on('end', () =>
      fs.writeFile(
        join(
          process.cwd(),
          'files',
          fileName,
        ),
        buf,
        err => {
          if (err)
            return reject(err)
          resolve()
        },
      ))
  })
}