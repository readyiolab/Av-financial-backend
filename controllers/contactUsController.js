const contactUsService = require("../services/contactUsService");
const emailService = require("../services/emailService");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  inquiry_type: Joi.string().valid("coaching", "workshop", "general", "testimonial").required(),
  phone: Joi.string().min(10).max(20).required(),
  message: Joi.string().min(1).max(1000).required(),
});

class ContactUsController {
  async createContact(req, res) {
    try {
      const { error, value } = contactSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: "Validation error", details: error.details });
      }

      const contact = await contactUsService.createContact(value);

      await emailService.sendAdminNotification({
        name: value.name,
        email: value.email,
        phone: value.phone,
        inquiry_type: value.inquiry_type,
        message: value.message,
      });

      res.status(201).json({ message: "Contact form submitted successfully", contact });
    } catch (err) {
      console.error("Error processing contact form:", err);
      res.status(500).json({ message: "Error processing contact form" });
    }
  }

  async getContacts(req, res) {
    try {
      const contacts = await contactUsService.getContacts();
      res.json(contacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ message: "Error fetching contacts" });
    }
  }
}

module.exports = new ContactUsController();