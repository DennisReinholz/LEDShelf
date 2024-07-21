module.exports.SendMail = async (req, res, nodemailer) => {
  const { name, email, subject, text, reason } = req.body;

  var transporter = nodemailer.createTransport({
    host: "mail.gmx.net",
    port: 587,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: "yto1@gmx.de",
      pass: "Alaskafilet007",
    },
  });

  try {
    await transporter.sendMail({
      from: "yto1@gmx.de",
      to: "dennis.reinholz@drperformance.de",
      subject: subject,
      html: `<h3>${reason}</h3>
      <p>LED-Shelf Anfrage</p>
      <p>From: <strong>${name} - ${email}</strong></p>          
      <div> 
        <p>${text}</p>
      </div>
      `,
    });
    res.status(200).send("E-Mail erfolgreich gesendet");
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
    res.status(500).send("Fehler beim Senden der E-Mail");
  }
};
