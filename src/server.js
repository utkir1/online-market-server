import express from 'express'
import { PORT } from './configs/config.js'
import errorHandler from './middlewares/errorHandler.js'
import userRouter from './routers/user.router.js'
import categoryRouter from './routers/category.router.js'
import subCategoryRouter from './routers/subcategory.router.js'
import productRouter from './routers/products.router.js'



const app = express()
app.use(express.json())

app.use(userRouter)
app.use(categoryRouter)
app.use(subCategoryRouter)
app.use(productRouter)



app.use(errorHandler)

app.all('/*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: req.url + ' is not found'
  })
})

app.listen(PORT, () => console.log(8000))