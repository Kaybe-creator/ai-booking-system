require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const CAL_API_KEY = process.env.CAL_API_KEY;

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// ✅ Get event types
app.get("/events", async (req, res) => {
  try {
    const response = await axios.get("https://api.cal.com/v2/event-types", {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});

// ✅ Book appointment
app.post("/book", async (req, res) => {
  try {
    const { name, email, startTime } = req.body;

    const response = await axios.post(
      "https://api.cal.com/v2/bookings",
      {
        eventTypeId: 5844629, // ✅ YOUR REAL EVENT ID
        start: startTime,
        responses: {
          name,
          email,
        },
        timeZone: "Africa/Johannesburg",
        language: "en",
        metadata: {}, // ✅ REQUIRED FIX
      },
      {
        headers: {
          Authorization: `Bearer ${CAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
   success: true,
   message: "Booking confirmed"
   });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});