const UserHost = require("../models/userAndHost");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await UserHost.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // Fix: changed && to || for correct credential validation
    if (!isMatch || role !== user.role) {
      return res.status(401).send("Invalid credentials or role mismatch");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Store session details
    req.session.userId = user._id;
    req.session.role = user.role;

    // Set JWT as httpOnly cookie
    res.cookie("token", token, { httpOnly: true });

    // Redirect based on role
    if (user.role === "host") {
      return res.redirect("/host/host-homes");
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};


exports.postSignup = async (req, res) => {
    const { personname, email, password, role } = req.body;

    const host = await UserHost.findOne({ email });

    if (host) return res.status(400).send("User already exists");

    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = await UserHost.create({
        personname,
        email,
        password: hashPwd,
        role: role || 'user'
    });

    let token = jwt.sign({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
    }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Optional: store token in cookie
    res.cookie('token', token, { httpOnly: true });

    if (newUser.role === 'host') {
        return res.redirect(`/host/host-homes`);
    } else {
        return res.redirect(`/login`);
    }

};

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.getSignup = (req, res) => {
    res.render('signup');
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    req.session.destroy(err => {
        if (err) return res.status(500).send('Could not log out.');
        res.redirect('/');
    });
};


