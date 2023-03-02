const { HttpError } = require("../helpers/HttpError");
const ctrlWrp = require("../helpers/controllersWrapper");
const { Contact, schemas } = require("../models/contact");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    try {
      const result = await Contact.find({ favorite });
      return res.json(result);
    } catch (error) {
      throw HttpError(400, "Check the correctness of the entered data");
    }
  }

  const result = await Contact.find({ owner }, null, { skip, limit });
  res.json(result);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Not found contact with id ${contactId}`);
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const body = req.body;
  const { _id: owner } = req.user;

  const { error } = schemas.addSchema.validate(body);
  if (error) {
    throw HttpError(400, "Missing required name field");
  }

  const result = await Contact.create({ ...body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, `Not found contact with id ${contactId}`);
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateById = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = schemas.addSchema.validate(body);
  if (error) {
    throw HttpError(400, "Missing fields");
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = schemas.updateFavoriteSchema.validate(body);
  if (error) {
    throw HttpError(400, "Missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrp(getAll),
  getById: ctrlWrp(getById),
  addContact: ctrlWrp(addContact),
  deleteContact: ctrlWrp(deleteContact),
  updateById: ctrlWrp(updateById),
  updateStatusContact: ctrlWrp(updateStatusContact),
};
