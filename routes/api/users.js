const express = require("express");
const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/signup", ctrl.signup);
router.get("/login");

module.exports = router;
