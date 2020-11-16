const jwt = require("jsonwebtoken");

const id = (req, res) => {
    const {authorization} = req.headers;
    const payload = authorization ? jwt.verify(authorization, process.env.JWT_SEC) : undefined;

    return payload.id;
};

module.exports = id;

