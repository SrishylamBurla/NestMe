import axios from "axios";

export const sendWhatsappLeadMessage = async ({
  phone,
  property,
}) => {
  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
    new URLSearchParams({
      From: "whatsapp:+14155238886",
      To: `whatsapp:${phone}`,
      Body: `New Lead for ${property.title}\n\nView Property: ${process.env.CLIENT_URL}/properties/${property._id}`,
    }),
    {
      auth: {
        username: process.env.TWILIO_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
    }
  );
};
