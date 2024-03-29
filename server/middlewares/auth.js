const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            console.log("Acess denied")
            return res.status(401).json({ msg: "Acess Denied!" });
        }
        const verified = jwt.verify(token, "passwordKey");

        if (!verified) {
            return res.status(401).json({
                message: "Token verification failed, Access Denied!"
            });
        }

        req.user = verified.id;
        req.token = token;
        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = auth;