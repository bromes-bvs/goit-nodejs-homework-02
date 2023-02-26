const express = require("express");
const ctrl = require("../../controllers/contacts");
const isValideId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:contactId", isValideId, ctrl.getById);
router.post("/", ctrl.addContact);
router.delete("/:contactId", isValideId, ctrl.deleteContact);
router.put("/:contactId", isValideId, ctrl.updateById);
router.patch("/:contactId/favorite", isValideId, ctrl.updateStatusContact);

module.exports = router;
