const express = require('express');
const hostRouter = express.Router();

const controller = require('../controllers/controller');
const signupController = require('../controllers/loginSignUpController');
const auth = require('../controllers/authController');
const hostController = require('../controllers/admin');

// Host Home Management
// Add Home
hostRouter.get('/add-home', auth.ensureHost, controller.getAddHome);
hostRouter.post('/add-home', auth.ensureHost, controller.postHome);

// View Host Homes
hostRouter.get('/host-homes', auth.ensureHost, controller.hostHomes);

// Edit Home
hostRouter.get('/edit-home/:id', auth.ensureHost, controller.getEditHome);
hostRouter.post('/edit-home/:id', auth.ensureHost, controller.postEditHome);

// Delete Home
hostRouter.post('/delete-home/:id', auth.ensureHost, controller.postDelete);

// Update Availability
hostRouter.post('/update-availability/:id', controller.updateAvailability);

//getting hosts
hostRouter.get('/hosts', hostController.getHosts);

//delete host
hostRouter.post('/host-delete/:id', controller.deleteHost);

// Host Auth Routes
hostRouter.get('/login', signupController.getLogin);
hostRouter.get('/signup', signupController.getSignup);
hostRouter.post('/login', signupController.postLogin);
hostRouter.post('/signup', signupController.postSignup);

hostRouter.get("/logout", signupController.logout);
module.exports = hostRouter;
