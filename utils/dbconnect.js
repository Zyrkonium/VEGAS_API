const config = reqlib("/config/config.json");
var mysql = require("mysql2/promise");

module.exports = async () => {
	const promise = new Promise(async (resolve, reject) => {
		try {
			const connexion = await mysql.createConnection({
				host: config.database.hostname,
				user: config.database.user,
				password: config.database.password,
				port: config.database.port,
				database: config.database.database,
				namedPlaceholders: true,
			});
			console.log("Connected to MYSQL as id " + connexion.threadId);

			resolve(connexion);
		} catch (error) {
			console.error("Mysql connection error, please check config.json file");
			reject(error);
		}
	});
	return promise;
};
