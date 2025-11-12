const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const db = require("../config/database");
const transporter = require("../utils/transporter");
const createEmailWrapper = require("../utils/emailTemplates"); // Add this for sendCampaignEmail

class NewsletterService {
  constructor() {
    this.transporter = transporter;
  }

  async createSubscription(email) {
    try {
      const existingSubscriptions = await db.select(
        "newsletter_subscriptions",
        "id, email, status, unsubscribe_token",
        "email = ?",
        [email]
      );

      const existingSubscription = Array.isArray(existingSubscriptions)
        ? existingSubscriptions[0]
        : existingSubscriptions;

      if (existingSubscription) {
        if (existingSubscription.status === "active") {
          throw new Error("Email is already subscribed");
        }

        if (
          existingSubscription.status === "pending" ||
          existingSubscription.status === "unsubscribed"
        ) {
          const unsubscribeToken = this.generateUnsubscribeToken(email);
          const hashedToken = await bcrypt.hash(unsubscribeToken, 10);

          await db.update(
            "newsletter_subscriptions",
            {
              status: "pending",
              unsubscribe_token: hashedToken,
              confirmed_at: null,
              unsubscribed_at: null,
              updated_at: new Date(),
            },
            "id = ?",
            [existingSubscription.id]
          );

          await this.sendConfirmationEmail(email, unsubscribeToken);

          const statusMessage =
            existingSubscription.status === "unsubscribed"
              ? "You have been resubscribed. Please check your email for confirmation."
              : "Subscription request is pending. A new confirmation email has been sent.";

          return {
            id: existingSubscription.id,
            email,
            status: "pending",
            message: statusMessage,
          };
        }
      }

      const unsubscribeToken = this.generateUnsubscribeToken(email);
      const hashedToken = await bcrypt.hash(unsubscribeToken, 10);

      const subscriptionData = {
        email,
        status: "pending",
        unsubscribe_token: hashedToken,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await db.insert(
        "newsletter_subscriptions",
        subscriptionData
      );

      await this.sendConfirmationEmail(email, unsubscribeToken);

      return {
        id: result.insert_id,
        email,
        status: "pending",
        message:
          "Subscription created successfully. Please check your email for confirmation.",
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async confirmSubscription(email, token) {
    try {
      const subscriptions = await db.select(
        "newsletter_subscriptions",
        "*",
        "email = ?",
        [email]
      );

      const subscription = Array.isArray(subscriptions)
        ? subscriptions[0]
        : subscriptions;

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const isValidToken = await bcrypt.compare(
        token,
        subscription.unsubscribe_token
      );
      if (!isValidToken) {
        throw new Error("Invalid confirmation token");
      }

      await db.update(
        "newsletter_subscriptions",
        {
          status: "active",
          confirmed_at: new Date(),
          updated_at: new Date(),
        },
        "id = ?",
        [subscription.id]
      );

      return {
        message: "Subscription confirmed successfully",
        email,
        status: "active",
      };
    } catch (error) {
      console.error("Error confirming subscription:", error);
      throw error;
    }
  }

  async unsubscribe(email, token = null) {
    try {
      const subscriptions = await db.select(
        "newsletter_subscriptions",
        "*",
        "email = ?",
        [email]
      );

      const subscription = Array.isArray(subscriptions)
        ? subscriptions[0]
        : subscriptions;

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      if (token) {
        const isValidToken = await bcrypt.compare(
          token,
          subscription.unsubscribe_token
        );
        if (!isValidToken) {
          throw new Error("Invalid unsubscribe token");
        }
      }

      await db.update(
        "newsletter_subscriptions",
        {
          status: "unsubscribed",
          unsubscribed_at: new Date(),
          updated_at: new Date(),
        },
        "id = ?",
        [subscription.id]
      );

      await this.sendUnsubscribeConfirmation(email);

      return {
        message: "Unsubscribed successfully",
        email,
        status: "unsubscribed",
      };
    } catch (error) {
      console.error("Error unsubscribing:", error);
      throw error;
    }
  }

  async getSubscriptions(options = {}) {
    try {
      const { status, page = 1, limit = 50 } = options;
      const offset = (page - 1) * limit;

      let where = "";
      let params = [];

      if (status) {
        where = "status = ?";
        params.push(status);
      }

      const subscriptions = await db.selectAll(
        "newsletter_subscriptions",
        "id, email, status, created_at, confirmed_at, unsubscribed_at",
        where,
        params,
        `ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
      );

      const countResult = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as total",
        where,
        params
      );

      return {
        subscriptions,
        pagination: {
          page,
          limit,
          total: countResult ? countResult.total : 0,
          pages: Math.ceil((countResult ? countResult.total : 0) / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    }
  }

  generateUnsubscribeToken(email) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${email}-${timestamp}-${randomString}`;
  }

  async getSubscriberStats() {
    try {
      const activeCount = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as count",
        "status = ?",
        ["active"]
      );

      const pendingCount = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as count",
        "status = ?",
        ["pending"]
      );

      const unsubscribedCount = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as count",
        "status = ?",
        ["unsubscribed"]
      );

      const totalCount = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as count"
      );

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentCount = await db.select(
        "newsletter_subscriptions",
        "COUNT(*) as count",
        "created_at >= ? AND status = ?",
        [thirtyDaysAgo, "active"]
      );

      return {
        total: totalCount ? totalCount.count : 0,
        active: activeCount ? activeCount.count : 0,
        pending: pendingCount ? pendingCount.count : 0,
        unsubscribed: unsubscribedCount ? unsubscribedCount.count : 0,
        recent_30_days: recentCount ? recentCount.count : 0,
      };
    } catch (error) {
      console.error("Error fetching subscriber stats:", error);
      throw error;
    }
  }

  async sendConfirmationEmail(email, token) {
    try {
      const confirmationUrl = `${
        process.env.FRONTEND_URL || "https://singhkarman.com"
      }/confirm-subscription?email=${encodeURIComponent(
        email
      )}&token=${encodeURIComponent(token)}`;

      const mailOptions = {
        from: `"Karman Singh" <${process.env.SMTP_FROM || "admin@singhkarman.com"}>`,
        to: email,
        subject: "Confirm Your Newsletter Subscription",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome to Karman Singh Newsletter!</h2>
            <p>Hi there,</p>
            <p>Thank you for subscribing to our newsletter! We're excited to share financial insights and strategies to help you build generational wealth.</p>
            <p>To complete your subscription, please <a href="${confirmationUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirm Your Subscription</a></p>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
            <p>If you didn't request this subscription, please ignore this email.</p>
            <p>Best regards,<br>The Karman Singh Team</p>
            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #7f8c8d;">
              <strong>Karman Singh</strong><br>
              Building generational wealth through purpose-driven financial strategies<br>
              <a href="mailto:admin@singhkarman.com">admin@singhkarman.com</a> | (206) 801-0330
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Confirmation email sent to", email, "- Message ID:", result.messageId);
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      if (error.responseCode === 550) {
        console.error(
          "Sender verification issue: Verify 'admin@singhkarman.com' or 'singhkarman.com' in SMTP2GO under Sending > Verified Senders."
        );
      }
      throw new Error("Failed to send confirmation email");
    }
  }

  async sendUnsubscribeConfirmation(email) {
    try {
      const mailOptions = {
        from: `"Karman Singh" <${process.env.SMTP_FROM || "admin@singhkarman.com"}>`,
        to: email,
        subject: "Unsubscription Confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Unsubscription Confirmed</h2>
            <p>Hi there,</p>
            <p>Your subscription to the Karman Singh newsletter has been successfully removed.</p>
            <p>If you change your mind and want to receive our financial insights again, you can always resubscribe on our website.</p>
            <p>Thank you for being part of our community!</p>
            <p>Best regards,<br>The Karman Singh Team</p>
            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #7f8c8d;">
              <strong>Karman Singh</strong><br>
              Building generational wealth through purpose-driven financial strategies<br>
              <a href="mailto:admin@singhkarman.com">admin@singhkarman.com</a> | (206) 801-0330
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Unsubscribe confirmation email sent to", email, "- Message ID:", result.messageId);
    } catch (error) {
      console.error("Error sending unsubscribe confirmation:", error);
      if (error.responseCode === 550) {
        console.error(
          "Sender verification issue: Verify 'admin@singhkarman.com' or 'singhkarman.com' in SMTP2GO."
        );
      }
      console.log(`Failed to send unsubscribe confirmation to ${email}`);
    }
  }

  async sendCampaignEmail(campaign, subscriber) {
    try {
      const unsubscribeUrl = `${
        process.env.FRONTEND_URL || "https://singhkarman.com"
      }/unsubscribe?email=${encodeURIComponent(
        subscriber.email
      )}&token=${encodeURIComponent(subscriber.unsubscribe_token)}`;

      const emailContent = createEmailWrapper(campaign.content, unsubscribeUrl);

      const mailOptions = {
        from: `"Karman Singh" <${process.env.SMTP_FROM || "admin@singhkarman.com"}>`,
        to: subscriber.email,
        subject: campaign.subject,
        html: emailContent,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Campaign email sent to", subscriber.email, "- Message ID:", result.messageId);
    } catch (error) {
      console.error("Error sending campaign email:", error);
      if (error.responseCode === 550) {
        console.error(
          "Sender verification issue: Verify 'admin@singhkarman.com' or 'singhkarman.com' in SMTP2GO."
        );
      }
      throw new Error("Failed to send campaign email");
    }
  }
}

module.exports = new NewsletterService();