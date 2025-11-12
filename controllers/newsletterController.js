
const newsletterService = require("../services/newsletterService");

class NewsletterController {
  async createSubscription(req, res) {
    try {
      const result = await newsletterService.createSubscription(req.body.email);
      res.json({ message: "Subscribed successfully", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async confirmSubscription(req, res) {
    try {
      const { email, token } = req.query;
      if (!email || !token) {
        return res.status(400).json({ message: "Email and token are required" });
      }
      const result = await newsletterService.confirmSubscription(email, token);
      res.json({ message: "Subscription confirmed successfully", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { email, token } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await newsletterService.unsubscribe(email, token);
      res.json({ message: "Unsubscribed successfully", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getSubscriptions(req, res) {
    try {
      const subscriptions = await newsletterService.getSubscriptions();
      res.json(subscriptions);
    } catch (err) {
      res.status(500).json({ message: "Error fetching subscriptions" });
    }
  }

  async getSubscriberStats(req, res) {
    try {
      const stats = await newsletterService.getSubscriberStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  }
}

module.exports = new NewsletterController();
