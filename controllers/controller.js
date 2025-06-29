// CONTROLLER FILE (controller.js)

const Image = require("../models/Image");
const Favorite = require("../models/favorite");
const person = require('../models/userAndHost');

async function fetchAllHomes() {
    try {
        return await Image.find();
    } catch (err) {
        console.log("Error retrieving Images", err);
        return [];
    }
}

async function fetchFavoriteHomes(userId) {
    try {
        return await Favorite.find({ user: userId });
    } catch (err) {
        console.log("Error fetching favorites", err);
        return [];
    }
}

exports.getFavorite = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login');

        const favhomes = await fetchFavoriteHomes(userId);
        res.render('stores/favorite', { favhomes });
    } catch (err) {
        console.error("Error fetching favorites", err);
        res.status(500).send("Failed to fetch favorites");
    }
};

exports.postFavorite = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login');

        const id = parseInt(req.body.id);
        if (isNaN(id)) return res.status(400).send("Invalid home ID");

        const allHomes = await fetchAllHomes();
        const home = allHomes.find(h => h.id === id);

        if (!home) return res.status(404).send("Home not found");

        const alreadyFav = await Favorite.findOne({ id: home.id, user: userId });
        if (!alreadyFav) {
            const favoriteData = { ...home.toObject(), user: userId };
            await Favorite.create(favoriteData);
        }

        res.redirect('/favorite');
    } catch (err) {
        console.error("Error saving favorite", err);
        res.status(500).send("Failed to save favorite");
    }
};

exports.postDeleteFav = async (req, res) => {
    try {
        const userId = req.session.userId;
        const delID = parseInt(req.params.id);
        if (isNaN(delID)) return res.redirect("/favorite");

        await Favorite.findOneAndDelete({ id: delID, user: userId });
        res.redirect('/favorite');
    } catch (err) {
        console.error("Home deletion failed", err);
        res.status(500).send("Failed to delete favorite");
    }
};

exports.getAddHome = async (req, res) => {
    res.render('host/addHome', { editing: false });
};

exports.postHome = async (req, res) => {
    const { homename, location, price, rating, photo, discription } = req.body;
    const hostId = req.session.userId;

    try {
        if (!hostId) return res.redirect('/login');

        const newHome = new Image({ homename, location, price, rating, photo, discription, host: hostId });
        await newHome.save();

        res.redirect("/host/host-homes");
    } catch (err) {
        console.error("Error saving home", err);
        res.status(500).send("Failed to register home");
    }
};

exports.hostHomes = async (req, res) => {
    const hostId = req.session.userId;
    if (!hostId) return res.redirect('/login');

    try {
        const registeredHomes = await Image.find({ host: hostId });
        res.render('host/editHome', { registeredHomes });
    } catch (err) {
        console.error("Error rendering host homes", err);
        res.status(500).send("Failed to load host homes");
    }
};

exports.getEditHome = async (req, res) => {
    const homeID = parseInt(req.params.id);
    const editing = true;
    const hostId = req.session.userId;

    try {
        const home = await Image.findOne({ id: homeID, host: hostId });

        if (!home) return res.redirect("/host/host-homes");

        res.render('host/addHome', { editing, home });
    } catch (err) {
        console.error("Error fetching home", err);
        res.status(500).send("Failed to fetch home");
    }
};


exports.postEditHome = async (req, res) => {
    const homeID = parseInt(req.params.id);
    const hostId = req.session.userId;
    const { homename, location, price, rating, photo, discription } = req.body;

    try {
        await Image.findOneAndUpdate(
            { id: homeID, host: hostId },
            { homename, location, price, rating, photo, discription }
        );

        res.redirect("/host/host-homes");
    } catch (err) {
        console.error("Error updating home", err);
        res.status(500).send("Failed to update home");
    }
};

exports.postDelete = async (req, res) => {
    const delID = parseInt(req.params.id);
    const hostId = req.session.userId;

    try {
        await Image.findOneAndDelete({ id: delID, host: hostId });
        res.redirect('/host/host-homes');
    } catch (err) {
        console.log("Error deleting home", err);
        res.status(500).json({error: err});
    }
};

exports.getDetails = async (req, res) => {
    const id = parseInt(req.params.id);
    const home = await Image.findOne({ id });
    if (!home) return res.redirect("/");
    res.render('stores/home-details', { home });
};

exports.home = async (req, res) => {
    try {
        const availableHomes = await Image.find({ isAvailable: true });
        res.render('home', { registeredHomes: availableHomes });
    } catch (err) {
        console.error("Error rendering home page:", err);
        res.status(500).send("Failed to load home page");
    }
};


exports.getSearch = async (req, res) => {
    const locationQuery = req.query.location;
    const allHomes = await fetchAllHomes();

    const filteredHomes = allHomes.filter(home =>
        home.location.toLowerCase().includes(locationQuery.toLowerCase())
    );

    res.render("home", { registeredHomes: filteredHomes });
};

exports.updateAvailability = async (req, res) => {
    try {
        const homeID = parseInt(req.params.id);
        let { isAvailable } = req.body;

        if (Array.isArray(isAvailable)) {
            isAvailable = isAvailable.includes("true");
        } else {
            isAvailable = isAvailable === "true";
        }

        await Image.findOneAndUpdate({ id: homeID }, { isAvailable });

        res.redirect('/host/host-homes');
    } catch (err) {
        console.error("Error updating availability:", err);
        res.status(500).send("Failed to update availability");
    }
};

exports.postBookings = (req, res) => {
    try{
        const ID = req.session.id;
        if(!ID) return res.redirect("/login");

        const homeId = req.body.id;
        if(!homeId) return res.json({error: "Invalid home"});

        const home = Image.findById(homeId);

        res.render('stores/bookingHome', {home});
    }
    catch(err){
        console.log(err);
        res.json({error: "Error in Booking home"});
    }
}

exports.getBookings = (req, res) => {
    res.render('stores/booking');
}

exports.getUsers = async (req, res) => {
    try {
        const users = await person.find({ role: 'user' });

        res.render('stores/users', { users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users." });
    }
};

exports.getHosts = async (req, res) => {
    try {
        const hosts = await person.find({ role: 'host' });

        res.render('stores/hosts', { hosts });
    } catch (err) {
        console.error("Error fetching hosts:", err);
        res.status(500).json({ error: "Failed to fetch hosts." });
    }
};

exports.getContact = (req, res) => {
    res.render('contact');
}

exports.getAbout = (req, res) => {
    res.render('about');
}

exports.getForm = (req, res) => {
    res.render('form');
}

exports.deleteUser = async (req, res) => {
    try {
        const delID = req.params.id;

        // Assuming host is stored in `person` collection
        await person.findByIdAndDelete(delID);

        // Optionally clean up other related data:
        await Favorite.deleteMany({ user: delID });
        await Image.deleteMany({ user: delID });
        
        res.redirect('/users');
    } catch (err) {
        console.error("Home deletion failed", err);
        res.status(500).send("Failed to delete favorite");
    }
};
exports.deleteHost = async (req, res) => {
    try {
        const delID = req.params.id;

        // Assuming host is stored in `person` collection
        await person.findByIdAndDelete(delID);

        // Optionally clean up other related data:
        await Favorite.deleteMany({ user: delID });
        await Image.deleteMany({ user: delID });

        res.redirect('/host/hosts');
    } catch (err) {
        console.error("Home deletion failed", err);
        res.status(500).send("Failed to delete favorite");
    }
};