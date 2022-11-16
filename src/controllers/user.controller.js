import sha256 from "sha256"
import jwt from "../utils/jwt.js"
import { BadRequestError, InternalServerError } from '../errors/errors.js'
import { read } from "../utils/model.js"


const SIGNIN = (req, res, next) => {
  try {
    const {username, password} = req.body

    const users = read('users')

    const user = users.find(user => user.username == username && user.password == sha256(password))

    if(!user) {
      return next(new BadRequestError(400, 'Wrong username or password'))
    }

    const agent = req.headers['user-agent']
    const ip = req.ip

    res.status(200).json({
      status:200,
      message: "Succesfully logged in",
      token: jwt.sign({userId: user.userId, agent: agent, ip: ip})
    })
   } catch (error) {
      return next(new InternalServerError(500, "Internal server error"))
   }
}




export default {
  SIGNIN
}