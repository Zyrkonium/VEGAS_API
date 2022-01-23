global.reqlib = require("app-root-path").require;

// Config
const config = reqlib("/config/config.json");

// Server
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");

const app = express();

// SSL
const privateKey = fs.readFileSync("ssl/key.pem", "utf8");
const certificate = fs.readFileSync("ssl/cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

// Post request params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Router
reqlib("/router")(app);

const normalizePort = (val) => {
	return parseInt(val, 10);
};
const HTTPport = normalizePort(process.env.HTTPPORT || config.server.port.http);
const HTTPSport = normalizePort(process.env.PORT || config.server.port.https);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Handle errors
const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};
httpServer.on("error", errorHandler);

httpServer.listen(HTTPport);
httpsServer.listen(HTTPSport);

// Connect to db and store connection in global var if succeeded
reqlib("/utils/dbconnect")()
	.then((connection) => {
		global.db = connection;
		console.log("Database acces initialized !");
	})
	// Else, close server
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
