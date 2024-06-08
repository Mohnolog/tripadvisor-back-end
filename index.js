const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

/* MAILGUN CONFIGURATION */
const mailgun = new Mailgun(formData);

const client = mailgun.client({
  username: "none",
  key: process.env.MAILGUN_KEY /* VOTRE CLÉ API */,
});

app.get("/", (req, res) => {
  res.send("route /");
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);

    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: process.env.MAIL,
      subject: "Formulaire projet fullstack",
      text: req.body.message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening");
});
