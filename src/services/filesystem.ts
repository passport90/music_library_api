import fs from 'fs'

export default class Filesystem {
  public readFileSync = (path: fs.PathOrFileDescriptor): Buffer => {
    return fs.readFileSync(path)
  }
}