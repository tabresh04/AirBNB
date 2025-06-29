const mongoose = require('mongoose');

const userAndHostSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    default: null,
  },
  personname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'host'],
    default: 'user'
  }
});

// Automatically assign a unique incremental ID before saving
userAndHostSchema.pre("save", async function (next) {
  if (!this.id) {
    const lastUser = await mongoose.model("UserHost").findOne().sort({ id: -1 });
    this.id = lastUser && lastUser.id ? lastUser.id + 1 : 1;
  }
  next();
});

const UserHost = mongoose.model("UserHost", userAndHostSchema);
module.exports = UserHost;
