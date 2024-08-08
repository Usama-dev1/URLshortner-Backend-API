const URL = require("../model/url");

const shortenController = async (req, res, next) => {
  const { url: originalUrl } = req.body;

  try {
    // Check if the URL is provided
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Create a new URL document
    const newUrl = new URL({
      url: originalUrl,
    });

    // Save the URL and generate the short ID
    await newUrl.save();

    // Construct the short URL
    const shortUrl = `${process.env.DOMAIN}/${newUrl.shortId}`;

    console.log("URL saved successfully");
    console.log("Short URL:", shortUrl);

    // Send the response with the short URL
    res.status(201).json({ shortUrl });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const fetchController = async (req, res, next) => {
  console.log("fetchController called");
  try {
    const { id } = req.params;
    console.log("Requested shortId:", id);

    const checkid = await URL.findOne({ shortId: id }).exec();
    if (!checkid) {
      console.log("URL not found for shortId:", id);
      return res.status(404).json({ message: "URL not found" });
    }

    const url = checkid.url;
    console.log("Original URL found:", url);

    console.log("Redirecting to:", url);
    return res.redirect(url);
  } catch (error) {
    console.error("Error in fetchController:", error);
    next(error);
  }
};

const fetchAllController = async (req, res) => {
  try {
    const allLinks = await URL.find({});
    res.status(200).json({ allLinks });
  } catch (error) {
    console.error("Error fetching all links:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the links." });
  }
};

module.exports = { shortenController, fetchController,fetchAllController };
