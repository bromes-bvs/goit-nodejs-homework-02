const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

module.exports = hashPassword;
