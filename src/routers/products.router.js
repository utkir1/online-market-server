import { Router } from "express";
import controller from '../controllers/products.controller.js'
import checkToken from '../middlewares/checkToken.js'


const router = Router()

router.get('/products', controller.GET)
router.get('/products/:id', controller.GETBYID)
router.post('/products',checkToken, controller.POST)
router.put('/products/:id',checkToken, controller.PUT)
router.delete('/products/:id',checkToken, controller.DELETE)



export default router