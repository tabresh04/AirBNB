const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, 
    homename: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    photo: { type: String, required: true },
    discription: { type: String, required: true },
    isAvailable: { type: Boolean, default: true},
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

homeSchema.pre("save", async function (next) {
    if (!this.id) {
        const lastHome = await mongoose.model("Image").findOne().sort({ id: -1 });
        this.id = lastHome && lastHome.id ? lastHome.id + 1 : 1;
    }
    next();
});

const Image = mongoose.model("Image", homeSchema);

module.exports = Image;
