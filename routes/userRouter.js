const express = require('express');
const userRouter = express.Router();
const controller = require('../controllers/controller');
const loginController = require('../controllers/loginSignUpController');
const auth = require('../controllers/authController');
const userController = require('../controllers/admin');

// Public Routes
userRouter.get("/", controller.home);
userRouter.get("/bookings", auth.ensureUser,controller.getBookings);
userRouter.get("/homes/:id", controller.getDetails);
userRouter.get("/favorite", auth.ensureUser,controller.getFavorite);
userRouter.post("/favorite", auth.ensureUser, controller.postFavorite);
userRouter.post("/delete-favorite/:id", auth.ensureUser, controller.postDeleteFav);
userRouter.get("/search", controller.getSearch);

//getting users
userRouter.get('/users', userController.getUsers);

//delete host
userRouter.post('/user-delete/:id', controller.deleteUser);

// Auth Routes
userRouter.get('/login', loginController.getLogin);
userRouter.get('/signup', loginController.getSignup);
userRouter.post("/login", loginController.postLogin);
userRouter.post("/signup", loginController.postSignup);

userRouter.get("/logout", loginController.logout);

userRouter.get("/contact", controller.getContact);
userRouter.get("/about", controller.getAbout);
userRouter.get("/form", controller.getForm);

module.exports = userRouter;
