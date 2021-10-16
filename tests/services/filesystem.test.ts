import fs from 'fs'
import Filesystem from '../../src/services/filesystem'

jest.mock('fs')

describe('Filesystem', () => {
  describe('readFileSync', () => {
    it('reads file from filesystem', () => {
      const filesystem = new Filesystem()
      const filePath = '/path/to/file'

      filesystem.readFileSync(filePath)

      expect(fs.readFileSync).toHaveBeenCalledTimes(1)
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath)
    })
  })
})