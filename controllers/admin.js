const userAndHost = require('../models/userAndHost');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await userAndHost.find({ role: 'user' });
    console.log(users);
    res.render('stores/users', { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Get all hosts
exports.getHosts = async (req, res) => {
  try {
    const hosts = await userAndHost.find({ role: 'host' });
    console.log(hosts);
    res.render('stores/hosts', { hosts });
  } catch (err) {
    console.error("Error fetching hosts:", err);
    res.status(500).send("Internal Server Error");
  }
};
