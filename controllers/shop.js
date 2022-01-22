exports.get = async (req, res, next) => {
	try {
		if (!req.query.n || typeof req.query.n != "string" || isNaN(req.query.n))
			throw new Error("Invalid argument type");
		const limit = Math.ceil(Number(req.query.n)).toString() || "3";
		let categ = null;
		if (
			!req.query.c ||
			typeof req.query.c != "string" ||
			!["accounts", "free_softwares", "softwares", "misc"].includes(req.query.c)
		)
			categ = "recents";
		else categ = req.query.c;

		let sql =
			"SELECT title, subtitle, channel, price FROM shop WHERE category=:categ ORDER BY created_at DESC LIMIT :limit";

		if (categ == "recents")
			sql =
				"SELECT title, subtitle, channel, price FROM shop ORDER BY created_at DESC LIMIT :limit";

		const [rows, info] = await global.db.execute(sql, {
			categ: categ,
			limit: limit,
		});
		res.status(200).json(rows);
	} catch (err) {
		res.status(400).json({ message: "Failed to query shop" });
	}
};
