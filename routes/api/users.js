const express = require("express");
const ctrl = require("../../controllers/auth");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/logout", auth, ctrl.logout);
router.get("/current", auth, ctrl.getCurrent);
router.patch("/", auth, ctrl.updateSubscribe);

module.exports = router;
