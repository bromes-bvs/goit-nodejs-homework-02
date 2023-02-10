const fs = require("fs").promises;

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contactsList);
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf-8");

    const searchContact = JSON.parse(contactsList).find(
      ({ id }) => id === contactId.toString()
    );
    if (!searchContact) {
      return console.log("Sorry there is no contact with this id");
    }
    return searchContact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf-8");
    const parsContacts = JSON.parse(contactsList);
    const contactIndex = parsContacts.findIndex(
      ({ id }) => id === contactId.toString()
    );
    if (contactIndex === -1) {
      return console.log("Sorry there is no contact with this id");
    }

    const deleteContact = parsContacts.splice(contactIndex, 1);

    await fs.writeFile(contactsPath, JSON.stringify(parsContacts, null, "\t"));
    return deleteContact;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
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

    console.table(contacts);
    return await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, null, "\t")
    );
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
