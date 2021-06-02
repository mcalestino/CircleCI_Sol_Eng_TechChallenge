const express = require("express");
const app = express();

app.get("/", function(req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.use("/public", express.static(`${__dirname}/public`));

const port = process.env.PORT || 5000;
const server = app.listen(port); // use port if provided, otherwise use 5000

module.exports = {
    port: port,
    server: server
}