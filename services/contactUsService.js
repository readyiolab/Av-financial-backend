const db = require("../config/database");

class ContactUsService {
  async createContact(data) {
    return await db.insert("contact_us", data);
  }

  async getContacts() {
    return await db.selectAll("contact_us", "*", "", [], "ORDER BY created_at DESC");
  }
}

module.exports = new ContactUsService();