global.reqlib = require("app-root-path").require;

const bcrypt = require("bcrypt");
const saltRounds = 15;

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

let user = {
	username: "Test",
	avatar_url: "https://i.postimg.cc/7hvwtw27/Zyrkonium-profile-pic.png",
	password: "lolmdrxd",
	color: "#0000FF",
};

bcrypt.hash(user.password, saltRounds, async function (err, hash) {
	if (err) throw err;
	user.password = hash;
	console.log(user);

	await global.db.execute(
		"INSERT INTO admins(username, password, avatar_url) VALUES(:username, :password, :avatar_url)",
		user
	);
	console.log("User successfully created !");
	process.exit();
});
