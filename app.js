const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routes & Models
const hostRouter = require('./routes/hostRouter');
const userRouter = require('./routes/userRouter');
const UserHost = require('./models/userAndHost');
const db = require("./utils/database");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 12345;
// Connect to MongoDB
db()
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
});

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Session configuration
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Change to true if HTTPS in production
    maxAge: 1000 * 60 * 60, // 1 hour
  },
}));

// ✅ Middleware to make user available in all views
app.use(async (req, res, next) => {
  try {
    if (req.session?.userId) {
      const user = await UserHost.findById(req.session.userId);
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
  } catch (err) {
    console.error("❌ Error fetching user for locals:", err);
    res.locals.user = null;
  }
  next();
});

// ✅ Make role/id available globally
app.use((req, res, next) => {
  res.locals.currentUser = {
    id: req.session?.userId || null,
    role: req.session?.role || null
  };
  next();
});

// ✅ Route handlers
app.use('/host', hostRouter);
app.use('/', userRouter);

// ✅ Fallback route (404)
app.use((req, res) => {
  res.status(404).render('404');
});
