const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: "Invalid URL format",
      },
    },
    shortId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate shortId
urlSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Check if the URL already exists
      const existingUrl = await this.constructor.findOne({ url: this.url });

      if (existingUrl) {
        // URL already exists; throw an error
        const err = new Error("URL already exists");
        err.statusCode = 400; // Bad Request
        return next(err);
      }

      // Generate a unique shortId
      let shortId;
      let attempts = 0;
      const maxAttempts = 1000; // Define a maximum number of attempts

      do {
        shortId = generateShortId();
        const existing = await this.constructor.findOne({ shortId }).exec();
        if (!existing) break;
        attempts++;
        if (attempts >= maxAttempts) {
          const err = new Error(
            "Short ID generation failed. Hit max attempts; try increasing the substring value."
          );
          err.statusCode = 500; // Internal Server Error
          return next(err);
        }
      } while (true);

      this.shortId = shortId;
    } catch (error) {
      // Handle unexpected errors
      error.message = "Short ID generation failed. Please try again later.";
      error.statusCode = 500; // Internal Server Error
      return next(error);
    }
  }
  next();
});
function generateShortId() {
  const timestamp = Date.now();
  return timestamp.toString(36).slice(-6);
}

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
