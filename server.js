const { name, email, startTime, start_time } = req.body;

let rawTime = startTime || start_time;

// 🔥 FALLBACK: if AI fails, create a default time
if (!rawTime) {
  console.log("No startTime provided, using fallback");

  const now = new Date();

  // default = next hour
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);

  rawTime = now.toISOString();
}

// Convert to date
let dateObj = new Date(rawTime);

if (isNaN(dateObj.getTime())) {
  return res.status(400).json({
    success: false,
    error: "Invalid date format"
  });
}

const formattedStartTime = dateObj.toISOString();