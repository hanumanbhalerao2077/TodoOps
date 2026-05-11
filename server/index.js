const express = require("express");
const dotenvFlow = require("dotenv-flow");
const todoRoutes = require("./routes/todoRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// dotenv-flow is used to manage environment variables across different environments
dotenvFlow.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || false
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// allow requests from outside resources like postman, or your frontend if you choose to build that out
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Input sanitization middleware
app.use((req, res, next) => {
  // Basic input sanitization
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
});

// the messenger between our app and our database
const mongoose = require("mongoose");
const { baseRoot } = require("./controllers/todoController");

// establish connection & give yourself a message so you know when its complete
const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((error) => console.log(error));

app.get("/", baseRoot);

app.use("/api", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
