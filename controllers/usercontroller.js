const router = require("express").Router();
const { User } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/register", async (req, res) => {
    let { username, password } = req.body;

    try {
        const newUser = await User.create({
            username,
            passwordhash: bcrypt.hashSync(password, 13)
        })
        res.status(201).json({
            message: "User registered!",
            user: newUser
        })
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "username in use"
            })
        }
        else {
            res.status(500).json({
                error: "Failed to register user"
            })
        }

    }
});

router.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    try {
        let loginUser = await User.findOne({
            where: { username: req.body.username }
        })
        if (loginUser&& bcrypt.compare(password, loginUser.passwordhash))
         {
            
        
            const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SEC, { expiresIn: 60*60*24 })
            res.status(200).json({
                message: "logged in",
                user: loginUser,
                token: token
            })
        }
        else {
            res.status(401).json({
                message: "login Failed: User info bad."
            })
        }


    }
    catch (error) {
        res.status(500).json({
            error: `Error fool! `,
        })
    }
})
module.exports = router;