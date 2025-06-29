const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    homename: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserHost',
        required: true
    }
});

// Auto-increment 'id' field manually
favoriteSchema.pre("save", async function(next) {
    if (!this.id) {
        const lastFav = await mongoose.model("Favorite").findOne().sort({ id: -1 });
        this.id = lastFav ? lastFav.id + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Favorite', favoriteSchema);
