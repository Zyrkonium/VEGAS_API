const bcrypt = require("bcrypt");

exports.post = async (req, res, next) => {
	if (!req.body || !req.body.username || !req.body.password || !req.body.message)
		return res.status(400).json({ message: "Bad request !" });

	const [rows, info] = await global.db.execute(
		"SELECT id, password, username, avatar_url FROM admins WHERE username=:username LIMIT 1",
		{
			username: req.body.username,
		}
	);

	if (rows.length < 1) return res.status(400).json({ message: "Invalid username or password" });

	bcrypt.compare(req.body.password, rows[0].password, async function (err, is_valid) {
		if (err) return res.status(500).json({ message: "Cryptography error" });

		if (!is_valid) return res.status(400).json({ message: "Invalid username or password" });

		const [result] = await global.db.execute(
			"INSERT INTO news(author_id, content) VALUES(:author_id, :content)",
			{
				author_id: rows[0].id,
				content: req.body.message,
			}
		);

		if (result.affectedRows != 1)
			return res.status(500).json({ message: "Database error, failed to save message" });

		const config = reqlib("/config/config.json");

		const embed_cfg = JSON.stringify(config.embed)
			.replace("{{TEXT}}", req.body.message)
			.replace("{{AUTHOR_NAME}}", rows[0].username)
			.replace("{{ICON_LINK}}", rows[0].avatar_url);

		var request = require("request");
		var options = {
			method: "POST",
			url: config.webhook_url,
			headers: {
				"Content-Type": "application/json",
				Cookie: "__cfruid=2c75d8d34a03311d4fe04bd7378fe11c8757ff9b-1642694548; __dcfduid=5de4cf767a0a11eca802daa792eaa583; __sdcfduid=5de4cf767a0a11eca802daa792eaa583a429cae90a48c8a5f9191b1864d93a40f24f5141077dbdcd5207a4129707f23b",
			},
			body: embed_cfg,
		};
		request(options, function (error, response) {
			if (error)
				return res.status(500).json({
					message:
						"Discord webhook error, your message was saved but not delivered to Discord. Please contact the developper.",
				});
		});

		res.status(201).json({
			message: "Message successfully saved !",
		});
	});
};

exports.get = async (req, res, next) => {
	try {
		if (!req.query.n || typeof req.query.n != "string" || isNaN(req.query.n))
			throw new Error("Invalid argument type");
		const limit = Math.ceil(Number(req.query.n)).toString() || "3";

		const [rows, info] = await global.db.execute(
			"SELECT news.content, news.created_at, admins.username, admins.avatar_url, admins.color FROM news LEFT JOIN admins ON news.author_id = admins.id ORDER BY created_at DESC LIMIT :limit",
			{
				limit: limit,
			}
		);
		res.status(200).json(rows);
	} catch (err) {
		res.status(400).json({ message: "Failed to query news" });
	}
};
