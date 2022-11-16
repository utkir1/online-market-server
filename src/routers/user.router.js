import { Router } from "express";
import controller from '../controllers/user.controller.js'


const router =  Router()

router.post('/signin', controller.SIGNIN)



export default router