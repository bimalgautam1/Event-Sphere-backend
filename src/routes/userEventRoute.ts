import express, { Router } from 'express'
import UserMiddleware, { Role } from '../middleware/userMiddleware'
import errorHandeling from '../services/errorHandeling'
import userEventController from '../controllers/userEventController'
// import errorHandler from '../services/errorHandler'
const router:Router = express.Router()


// router.post("/register",UserController.register)
// router.get("/register",UserController.register)


router.route("/")
.post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Attendee),errorHandeling(userEventController.eventRegister))
.get(UserMiddleware.isUserLoggedIn,errorHandeling(userEventController.getAllEvents))
.delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Attendee),errorHandeling(userEventController.cancelRegister))

router.route("/get-single-event/").get(UserMiddleware.isUserLoggedIn,errorHandeling(userEventController.getOneEvent))

export default router  