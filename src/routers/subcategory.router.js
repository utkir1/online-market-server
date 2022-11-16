import { Router } from "express";
import controller from '../controllers/subcategory.controller.js'
import checkToken from "../middlewares/checkToken.js";


const router =  Router()

router.get('/subcategories', controller.GET)
router.get('/subcategories/:id', controller.GETBYID)
router.post('/subcategories',checkToken, controller.POST)
router.put('/subcategories/:id',checkToken, controller.PUT)
router.delete('/subcategories/:id',checkToken, controller.DELETE)



export default router