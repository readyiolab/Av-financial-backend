const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validate, schemas } = require("../middleware/validate");

router.post("/signup", validate(schemas.signup), authController.signup);
router.post("/login", validate(schemas.login), authController.login);
router.get("/check-auth", authController.checkAuth);

module.exports = router;