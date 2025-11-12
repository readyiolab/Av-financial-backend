const authService = require("../services/authService");
const Joi = require("joi");



class AuthController {
  async signup(req, res) {
    try {
      const result = await authService.signup(req.body.username, req.body.password);
      res.status(201).json({ message: "Admin created successfully", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body.username, req.body.password);
      res.json({ message: "Login successful", data: result });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  async checkAuth(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.json({ isAuthenticated: false });
      await authService.verifyToken(token);
      res.json({ isAuthenticated: true });
    } catch (err) {
      res.json({ isAuthenticated: false });
    }
  }
}

module.exports = new AuthController();