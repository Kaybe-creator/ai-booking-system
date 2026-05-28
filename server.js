require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const CAL_API_KEY = process.env.CAL_API_KEY;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/book", async (req, res) => {
  try {
    const { name, email, startTime } = req.body;

    const response = await axios.post(
      "https://api.cal.com/v1/bookings",
      {
        eventTypeId: 1,
        start: startTime,
        responses: {
          name,
          email
        },
        timeZone: "Africa/Johannesburg",
        language: "en"
      },
      {
        headers: {
          Authorization: `Bearer ${CAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      booking: response.data
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});