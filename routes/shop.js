// Init router
const express = require("express");
const router = express.Router();

// Load controllers
const shopCtrl = reqlib("/controllers/shop");

// Routes
// router.post("/post", shopCtrl.post);
router.get("/get", shopCtrl.get);

// Export router
module.exports = router;
