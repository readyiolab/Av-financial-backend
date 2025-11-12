const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validate");

router.post("/", validate(schemas.applicationSchema), applicationController.createApplication); // Fix: Use applicationSchema
router.get("/", authMiddleware, applicationController.getApplications);

module.exports = router;