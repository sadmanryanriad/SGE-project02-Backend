const decodeEmail = (req, res) => {
  const encodedEmail = req.params.encodedEmail;
  const realEmail = Buffer.from(encodedEmail, "base64").toString("utf-8");

  if (realEmail) {
    return res.status(200).json({ email: realEmail });
  } else {
    return res
      .status(404)
      .json({ error: "Email not found for the provided encoded string" });
  }
};

module.exports = decodeEmail;
