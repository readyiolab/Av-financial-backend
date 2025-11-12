const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validate");

router.post("/", validate(schemas.subscription), newsletterController.createSubscription);
router.post("/unsubscribe", validate(schemas.unsubscribe), newsletterController.unsubscribe);
router.get("/", authMiddleware, newsletterController.getSubscriptions);
router.get("/confirm", newsletterController.confirmSubscription);


// Protected routes (admin only)
router.get("/", authMiddleware, newsletterController.getSubscriptions);
router.get("/stats", authMiddleware, newsletterController.getSubscriberStats);
module.exports = router;