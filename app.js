var express = require("express");
var mysql = require("mysql");
var app = express();
const helper = require("./helper");
var btoa = require("btoa");
var atob = require("atob");

const endPoint = "http://10.0.0.223:8080";
const fullMail = require("./views/design");

var conn = mysql.createPool({
    host: "remotemysql.com",
    user: "pIEQA6MsL8",
    password: "M7CmwPbOeF",
    database: "pIEQA6MsL8"
});

app.set("view engine", "ejs");

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
    conn.query("select * from user WHERE status = 0", [], (err, result) => {
        if (err) return;

        console.log(result.length);

        result.forEach(el => {
            let link = `${endPoint}/event/${btoa(el.email)}`;
            let msg = fullMail(link);
            helper.sendEmail(el.email, "Invited We Are !", msg);
        });
    });
};

app.get("/event/:email/:action", function(req, res) {
    let email = atob(req.params.email);
    conn.query("update user set action=?,status=1 WHERE email=?", [req.params.action, email], (err, result) => {
        if (err) {
            return;
        }
        res.render("index", {
            action: req.params.action
        });
    });
});

const port = process.env.PORT || 11000;
const server = app.listen(port, () => console.log(`Agusto Email Notification Service on: ${port}`));

process.on("exit", () => server.close());
process.on("SIGTERM", () => server.close());
process.on("uncaughtException", () => server.close());
