// Init router
const express = require("express");
const router = express.Router();

// Load controllers
const newsCtrl = reqlib("/controllers/news");

// Routes
router.post("/post", newsCtrl.post);
router.get("/get", newsCtrl.get);

// Export router
module.exports = router;
