var express = require("express");
var app = express();
const helper = require("./helper");
var btoa = require("btoa");
var atob = require("atob");
var sync = require("sync-mysql");
const bodyParser = require("body-parser");

const endPoint = "https://agustoevents.herokuapp.com";
// const endPoint = "http://10.0.0.223:2000";
const fullMail = require("./views/design");

var conn = new sync({
    host: "remotemysql.com",
    user: "pIEQA6MsL8",
    password: "M7CmwPbOeF",
    database: "pIEQA6MsL8"
});

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    sendTheMail();
    res.send("Welcome to Email App");
});

app.use(express.static("public"));

// app.get("/about", function(req, res) {
//     res.render("pages/about");
// });
const sendTheMail = () => {
    // get list from db

    var result = conn.query("select * from user WHERE status = 0");

    if (result) {
        result.forEach(el => {
            let link = `${endPoint}/event/${btoa(el.email)}`;
            let msg = fullMail(link);
            helper.sendEmail(el.email, "Agusto & Co Farewell Dinner", msg);
        });
    }
};

app.get("/event/:email/:action", function(req, res) {
    let email = atob(req.params.email);
    const result = conn.query("update user set action=?,status=1 WHERE email=?", [req.params.action, email]);
    if (result) {
        let userDetails = conn.query("select * from user where email=?", [email]);
        if (userDetails) {
            userDetails = userDetails[0];
            res.render("index", {
                email: btoa(email),
                action: req.params.action,
                firstname: userDetails.firstname,
                lastname: userDetails.surname,
                company: userDetails.company,
                position: userDetails.position
            });
        }
    }
});

app.post("/events/:email/register", function(req, res) {
    let email = atob(req.params.email);
    let position = req.body.position;
    let meal = req.body.meal;
    let update = conn.query("update user set position=?,meal=? WHERE email=?", [position, meal, email]);
    if (update) {
        res.render("index", {
            action: 1
        });
    }
});

const port = process.env.PORT || 16000;
const server = app.listen(port, () => console.log(`Agusto Email Notification Service on: ${port}`));
