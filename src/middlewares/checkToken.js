import jwt from '../utils/jwt.js'

export default (req, res, next ) => {
  try {
    const {token} = req.headers

    if(!token) {
      throw new Error('required token')
    }

    const { userId, agent, ip } = jwt.verify(token)

    if(ip != req.ip || agent != req.headers['user-agent']) {
      throw new Error('Bu token boshqa joydan olingan')
    }

    return next()

  } catch (error) {
    res.status(403).json({
      status: 403,
      message: error.message
    })
  }
}