app.post("/book", async (req, res) => {
  try {
    const { name, email, startTime, start_time } = req.body;

    let rawTime = startTime || start_time;

    // 🔥 fallback if missing
    if (!rawTime) {
      console.log("No startTime provided, using fallback");

      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      now.setSeconds(0);

      rawTime = now.toISOString();
    }

    let dateObj = new Date(rawTime);

    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format"
      });
    }

    const formattedStartTime = dateObj.toISOString();

    // 👇 your axios call stays the same
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

    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Booking failed" });
  }
});