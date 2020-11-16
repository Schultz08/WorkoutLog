
require("dotenv").config();
const express = require("express");
const controllers = require("./controllers");
const db = require("./db");
const app = express();

app.use(require("./middleware/headers"));
app.use(express.json());

app.use("/log", controllers.logcontroller);
app.use("/user", controllers.usercontroller);


db.authenticate()
.then(() => db.sync()) //{force: true}
.then(() => {
    app.listen(process.env.PORT, ()=> console.log(`Server app is on port ${process.env.PORT}`));
    
}).catch(err => console.log(err))
