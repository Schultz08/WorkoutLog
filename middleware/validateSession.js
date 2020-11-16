const jwt = require("jsonwebtoken");
const {User} = require("../models");

const validateSession = (req, res, next) =>{
    if(req.method === "OPTIONS")
    {
        return next();
    }
    else if(req.headers.authorization)
    {
        
        const {authorization} = req.headers;
        const payload = authorization ? jwt.verify(authorization, process.env.JWT_SEC) : undefined;

        if(payload){
            User.findOne({
                where: {id: payload.id}
            })
            .then(user => {
                req.user = user;
                next();
            })
            }else{
                res.status(401).json({
                message:" No Auth"
            })
        }
    }else{
        res.status(500).json({
        error:" oof"
    })}
}

module.exports = validateSession;