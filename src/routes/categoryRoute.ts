import express, { Router } from 'express'
import EventController from '../controllers/eventController'
import UserMiddleware, { Role } from '../middleware/userMiddleware'
// import errorHandler from '../services/errorHandler'
import { multer,storage } from "../middleware/multerMiddleware";
import errorHandeling from '../services/errorHandeling';
const upload = multer({storage:storage})
const router:Router = express.Router()
import categoryController from '../controllers/categoryController';


// router.post("/register",UserController.register)
// router.get("/register",UserController.register)


//add new category and get all categories
router.route("/")
.get(UserMiddleware.isUserLoggedIn,errorHandeling(categoryController.getAllCategory))
.post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Organizer),errorHandeling(categoryController.addCategory))

//provides category's data
router.route('/category-data').get(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Organizer),errorHandeling(categoryController.getCategoryData))

//provides event data based on category
router.route('/event-data/:id').get(UserMiddleware.isUserLoggedIn,errorHandeling(categoryController.getDataByCategory)) 

export default router