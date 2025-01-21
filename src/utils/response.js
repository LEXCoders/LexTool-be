export const sendErrorResponse = (res, status, errors) => {
  return res.status(status).json({ errors: [errors].flat() })
}
