import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { UPLOADS_DIRECTORY_PATH } from '../constants/uploads.js'

if (!fs.existsSync(UPLOADS_DIRECTORY_PATH)) {
    fs.mkdirSync(UPLOADS_DIRECTORY_PATH, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIRECTORY_PATH) 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extname = path.extname(file.originalname)
        cb(null, `${uniqueSuffix}${extname}`)
      }
})

export const upload = multer({ 
    limits: { fileSize: 2 * 1024 * 1024 },
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error('Invalid file type'), false)
        }
    }
})