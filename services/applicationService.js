const db = require("../config/database");

class ApplicationService {
  async createApplication(data) {
    return await db.insert("applications", data);
  }

  async getApplications() {
    return await db.selectAll("applications", "*", "", [], "ORDER BY created_at DESC");
  }
}

module.exports = new ApplicationService();