const express = require("express");
const router = express.Router();
const { Log } = require("../models/index");
const validateSession = require("../middleware/validateSession");
const jwt = require("jsonwebtoken")

const getUserId = require("../middleware/helper")





//GET all logs
router.get("/", validateSession, (req, res) => {

    const userId = getUserId(req, res)
    
    Log.findAll({where: {owner_id: (userId).toString()}})
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }));

});

//POST new logs
router.post("/", validateSession, async (req, res) => {
        const userId = getUserId(req, res)
    try {
        const description = req.body.description;
        const definition = req.body.definition;
        const result = req.body.result;
        const owner_id = userId;

        let newLog = await Log.create({
            description,
            definition,
            result,
            owner_id
        });
        res.status(200).json({
            Log: newLog,
            message: "Log Created"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Log Burnt"
        });
    }
});


//GET logs by id
router.get('/:id', validateSession, (req, res) => {
    Log.findOne({ where: { id: req.params.id } })
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }))
})


//PUT existing Logs
router.put("/:id", validateSession, (req, res) => {
    const query = req.params.id;
    Log.update(req.body, { where: { id: query } })
        .then((logUpdated) => {
            Log.findOne({ where: { id: query } }).then((updatedLog) => {
                res.status(200).json({
                    log: updatedLog,
                    message: "log updated successful",
                    logChanged: logUpdated,
                });
            });
        })
        .catch((err) => res.json(err));
});

//DELETE LOGS
router.delete("/:id", validateSession, (req, res) => {
    Log.destroy({
        where: { id: req.params.id }
    })
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json(err))
})

module.exports = router;