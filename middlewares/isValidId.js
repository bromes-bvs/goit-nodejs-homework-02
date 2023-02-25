const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers/HttpError");

const isValideId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(HttpError(404, `id '${contactId}' is not valid`));
  }
  next();
};

module.exports = isValideId;
