import { Router } from "express";
import controller from '../controllers/category.controller.js'
import checkToken from "../middlewares/checkToken.js";


const router =  Router()

router.get('/categories', controller.GET)
router.get('/categories/:id', controller.GETBYID)
router.post('/categories',checkToken, controller.POST)
router.put('/categories/:id',checkToken, controller.PUT)
router.delete('/categories/:id',checkToken, controller.DELETE)



export default router