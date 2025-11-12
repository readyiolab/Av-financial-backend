const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const schemas = {
  signup: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  applicationSchema: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    pdf: Joi.string()
      .valid("Tax-Advantaged Income Stream.pdf", "Medicare Benefits Without Overpaying.pdf", "Smart Investments.pdf")
      .required(),
  }),
  subscription: Joi.object({
    email: Joi.string().email().required(),
  }),
  unsubscribe: Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().optional(), // Token is optional
  }),
  contactUs: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    inquiry_type: Joi.string().valid("coaching", "workshop", "general", "testimonial").required(),
    phone: Joi.string().min(10).max(20).required(),
    message: Joi.string().min(1).max(1000).required(),
  }),
};

module.exports = { validate, schemas };