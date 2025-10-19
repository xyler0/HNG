const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const userProfile = {
  email: "harjaserridwan@gmail.com",
  name: "Ajasa Ridwan",
  stack: "Node.js/Express",
};

app.get("/me", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000,
    });

    return res.status(200).json({
      status: "success",
      user: userProfile,
      timestamp: new Date().toISOString(),
      fact: response.data.fact,
    });
  } catch (error) {
    console.error("Error fetching cat fact:", error.message);

    return res.status(200).json({
      status: "success",
      user: userProfile,
      timestamp: new Date().toISOString(),
      fact: "Cats are fascinating creatures loved worldwide.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
