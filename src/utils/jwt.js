import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export default {
  sign: (payload) =>  jwt.sign(payload, process.env.SECRET_KEY),
  verify: (token) =>  jwt.verify(token, process.env.SECRET_KEY)
}