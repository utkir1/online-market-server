

export default  ( error, req, res, next ) => {
  if(error.status != 500 ) {
    return res.status(error.status).json({
      status: error.status,
      error: error.name,
      message: error.message
    })
  }
  res.status(error.status).json({
    status: error.status,
    error: error.name,
    message: error.message
  })
}