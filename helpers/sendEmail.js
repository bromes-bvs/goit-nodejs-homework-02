const nodemailer = require("nodemailer");
const { HttpError } = require("./HttpError");

const { MAIL_PASSWORD } = process.env;

const nodeConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "mikox@ukr.net",
    pass: MAIL_PASSWORD,
  },
};

const nodeTransport = nodemailer.createTransport(nodeConfig);

const sendMail = async (message) => {
  try {
    const email = { ...message, from: "mikox@ukr.net" };
    await nodeTransport.sendMail(email);
    return true;
  } catch (error) {
    throw HttpError(
      500,
      "We're sorry, we couldn't send the verification email."
    );
  }
};
module.exports = sendMail;

// -----------------------------------------------------------------------------

// const sgMail = require("@sendgrid/mail");
// const { SENDGRID_API_KEY } = process.env;
// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendMail = async (message) => {
//   try {
//     const email = { ...message, from: "bor22newlife@gmail.com" };
//     await sgMail.send(email);
//     return true;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// module.exports = sendMail;
