const Joi = require("joi");
const { Schema, model } = require("mongoose");

const usersSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.post("save", (error, date, next) => {
  error.status = 400;
  next();
});

const addSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required().unique(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string().token(),
});

// const updateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });
const schemas = {
  addSchema,
};

const User = model("user", usersSchema);

module.exports = {
  User,
  schemas,
};
