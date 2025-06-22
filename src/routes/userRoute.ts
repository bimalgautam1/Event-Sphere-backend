import express, { Router } from 'express'
import userController from '../controllers/userController'
import errorHandeling from '../services/errorHandeling'
// import errorHandler from '../services/errorHandler'
const router:Router = express.Router()

// router.post("/register",UserController.register)
// router.get("/register",UserController.register)


router.route("/register").post(errorHandeling (userController.register))
router.route("/login").post(errorHandeling(userController.login))
router.route("/forget-password").post(errorHandeling(userController.forgetPassword))
router.route("/verify-otp").post(errorHandeling(userController.verifyOtp))


// router.route("/login").post(UserController.login)
// router.route("/forget-password").post(UserController.forgetPassword)


export default router  