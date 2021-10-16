import fs from 'fs'
import Filesystem from '../../../src/services/node/filesystem'

jest.mock('fs')

describe('Filesystem', () => {
  describe('readFileSync', () => {
    it('reads file from filesystem', () => {
      const stubFilePath = '/path/to/file'
      const stubBuffer = {};

      (fs.readFileSync as jest.Mock).mockImplementation(
        (filePath) => filePath === stubFilePath ? stubBuffer : null 
      )

      const filesystem = new Filesystem()
      const buffer = filesystem.readFileSync(stubFilePath)

      expect(buffer).toBe(stubBuffer)

    })
  })
})