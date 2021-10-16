import fs from 'fs'
import FilesystemInterface from '../../interfaces/node/filesystemInterface'

export default class Filesystem implements FilesystemInterface {
  public readFileSync = (path: fs.PathOrFileDescriptor): Buffer => fs.readFileSync(path)
}