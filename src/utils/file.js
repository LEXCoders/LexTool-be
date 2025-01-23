import fs from 'fs'

export const deleteFile = (path, errorLog) => {
  if (fs.existsSync(path)) {
    try {
      fs.unlinkSync(path)
    } catch (e) {
      console.error(errorLog, e)
    }
  }
}
