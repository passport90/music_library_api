import fs from 'fs'

export default interface FilesystemInterface {
  readFileSync: (path: fs.PathOrFileDescriptor) => Buffer
}