const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");



// Middleware to validate request body
const { validate, schemas } = require("../middleware/validate");
// Route to create a new contact
router.post(
  "/",
  validate(schemas.contactUs), // Assuming you have a contactUs schema in your validation middleware
  contactUsController.createContact
);
// Route to get all contacts
router.get("/", contactUsController.getContacts);
// Export the router
module.exports = router;
