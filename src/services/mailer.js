import nodemailer from 'nodemailer'
import {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_USER,
  MAILER_PASSWORD
} from '../config/env.js'

export const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  secure: false,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD
  }
})
