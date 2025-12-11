const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Initialize dotenv once with quiet mode to suppress verbose logs
require("dotenv").config({ quiet: true });

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactRoutes = require("./routes/contactRoutes");
// const campaignRoutes = require("./routes/campaignRoutes");
// const NewsletterScheduler = require("./utils/scheduler"); 

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: [
      "https://avfinancial.com/",
      "http://localhost:8080", // 👈 allow local frontend for development
    ], // Adjust to your frontend URL
  credentials: true, // Allow cookies to be sent
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/campaigns", campaignRoutes);

// Start the newsletter scheduler
// NewsletterScheduler.start();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});