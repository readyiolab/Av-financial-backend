const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

class AuthService {
  async signup(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = { username, password: hashedPassword };
    return await db.insert("admins", data);
  }

  async login(username, password) {
    const admin = await db.select("admins", "*", "username = ?", [username]);
    if (!admin) throw new Error("Invalid username or password");

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new Error("Invalid username or password");

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token, user: { id: admin.id, username: admin.username } };
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}

module.exports = new AuthService();