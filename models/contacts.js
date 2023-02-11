const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contactsList);
};

const getContactById = async (contactId) => {
  const contactsList = await fs.readFile(contactsPath, "utf-8");

  const searchContact = JSON.parse(contactsList).find(
    ({ id }) => id === contactId.toString()
  );
  if (!searchContact) {
    return null;
  }
  return searchContact;
};

const removeContact = async (contactId) => {
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const parsContacts = JSON.parse(contactsList);
  const contactIndex = parsContacts.findIndex(
    ({ id }) => id === contactId.toString()
  );
  if (contactIndex === -1) {
    return null;
  }

  const deleteContact = parsContacts.splice(contactIndex, 1);

  await fs.writeFile(contactsPath, JSON.stringify(parsContacts, null, "\t"));
  return deleteContact;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const newContact = {
    id: nanoid(4),
    name: name,
    email,
    phone,
  };
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(contactsList);
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, "\t"));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contactsList = await fs.readFile(contactsPath, "utf-8");
  const parsContacts = JSON.parse(contactsList);
  const index = parsContacts.findIndex(({ id }) => id === contactId.toString());

  if (index === -1) {
    return null;
  }
  parsContacts[index] = { id: contactId, name, email, phone };

  await fs.writeFile(contactsPath, JSON.stringify(parsContacts, null, "\t"));
  return parsContacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
