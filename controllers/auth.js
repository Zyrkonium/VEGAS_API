// const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
	res.json({
		message: "register",
	});
};

exports.login = async (req, res, next) => {
	// if (!req.body || !req.body.username || !req.body.password)
	// return res.status(400).json({ message: "Bad request !" });

	// 	const [rows, info] = await global.db.execute(
	// 		"SELECT COUNT(*) AS user_exists FROM admins WHERE username=:username LIMIT 1",
	// 		{
	// 			username: req.body.username,
	// 		}
	// 	);

	// 	if (!rows[0].user_exists)
	// 		return res.status(400).json({ message: "Invalid username or password" });

	res.json({
		message: "login",
	});
};
