exports.ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/login');
};

exports.ensureHost = (req, res, next) => {
    if (req.session?.userId && req.session.role === 'host') {
        return next();
    }
    return res.redirect('/host/login');
};

exports.ensureUser = (req, res, next) => {
    if (req.session?.userId && req.session.role === 'user') {
        return next();
    }
    return res.redirect('/login');
};
