const adminCheck = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = adminCheck;
