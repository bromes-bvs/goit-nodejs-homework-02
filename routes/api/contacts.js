const express = require("express");
const ctrl = require("../../controllers/contacts");
const isValideId = require("../../middlewares/isValidId");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, ctrl.getAll);
router.get("/:contactId", auth, isValideId, ctrl.getById);
router.post("/", auth, ctrl.addContact);
router.delete("/:contactId", auth, isValideId, ctrl.deleteContact);
router.put("/:contactId", auth, isValideId, ctrl.updateById);
router.patch(
  "/:contactId/favorite",
  auth,
  isValideId,
  ctrl.updateStatusContact
);

module.exports = router;
