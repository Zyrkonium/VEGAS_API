module.exports = (app) => {
	const newsRoutes = reqlib("/routes/news");
	const shopRoutes = reqlib("/routes/shop");

	// Routes
	app.use("/api/news", newsRoutes);
	app.use("/api/shop", shopRoutes);
};
