require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const CAL_API_KEY = process.env.CAL_API_KEY;

// Test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Get events
app.get("/events", async (req, res) => {
  try {
    const response = await axios.get("https://api.cal.com/v2/event-types", {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});

// Book appointment
app.post("/book", async (req, res) => {
  console.log("Incoming body:", req.body);
  
  try {
  const { name, email, startTime, start_time } = req.body;

const rawTime = startTime || start_time;

if (!rawTime) {
  return res.status(400).json({
    success: false,
    error: "Missing startTime"
  });
}

let dateObj = new Date(rawTime);

if (isNaN(dateObj.getTime())) {
  return res.status(400).json({
    success: false,
    error: "Invalid date format"
  });
}

const formattedStartTime = dateObj.toISOString();

    // ✅ Send to Cal.com
    const response = await axios.post(
      "https://api.cal.com/v2/bookings",
      {
        eventTypeId: 5844629,
        start: formattedStartTime, // ✅ MUST be "start"
        responses: {
          name: name,
          email: email
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

    // ✅ Retell-friendly response
    res.json({
      success: true
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
  console.log("Server running on port " + PORT);
});