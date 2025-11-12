const applicationService = require("../services/applicationService");
const emailService = require("../services/emailService");
const Joi = require("joi");

const applicationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(20).required(),
  pdf: Joi.string()
    .valid(
      "Tax-Advantaged Income Stream.pdf",
      "Medicare Benefits Without Overpaying.pdf",
      "Smart Investments.pdf"
    )
    .required(),
});

class ApplicationController {
  async createApplication(req, res) {
    try {
      const { error } = applicationSchema.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const data = req.body;

      // ✅ Respond instantly (user sees success immediately)
      res.json({
        message: "Your request was submitted successfully!",
      });

      // ✅ Continue backend work in background
      setTimeout(async () => {
        try {
          // Save to DB
          await applicationService.createApplication(data);

          // Send emails in parallel
          await Promise.all([
            emailService.sendPDFEmail(data),
            emailService.sendAdminNotification(data),
          ]);

          console.log(`✅ Application processed successfully for ${data.email}`);
        } catch (err) {
          console.error("❌ Background processing failed:", err.message);
        }
      }, 1000); // Delay slightly (1s) to not block event loop

    } catch (err) {
      console.error("❌ Error in createApplication:", err);
      res.status(500).json({ message: "Error processing application" });
    }
  }

  async getApplications(req, res) {
    try {
      const applications = await applicationService.getApplications();
      res.json(applications);
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
      res.status(500).json({ message: "Error fetching applications" });
    }
  }
}

module.exports = new ApplicationController();
