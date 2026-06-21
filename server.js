const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// HEALTH CHECK (so you know server is alive)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 🔥 BOOKING ROUTE (THIS IS THE ONLY PLACE req.body IS USED)
app.post("/book", async (req, res) => {
  try {
    const { name, email, startTime, start_time } = req.body;

    let rawTime = startTime || start_time;

    // 🔥 fallback if AI fails to send time
    if (!rawTime) {
      console.log("No startTime provided, using fallback");

      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      now.setSeconds(0);

      rawTime = now.toISOString();
    }

    // 🔥 validate & convert date
    const dateObj = new Date(rawTime);

    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format"
      });
    }

    const formattedStartTime = dateObj.toISOString();

    console.log("Incoming booking:", {
      name,
      email,
      formattedStartTime
    });

    // 🔥 CAL.COM API CALL
    const response = await axios.post(
      "https://api.cal.com/v2/bookings",
      {
        eventTypeId: 5844629,
        start: formattedStartTime,
        responses: {
          name,
          email
        },
        timeZone: "Africa/Johannesburg",
        language: "en"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("BOOKING ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: "Booking failed"
    });
  }
});

// SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});