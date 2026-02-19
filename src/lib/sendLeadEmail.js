import { transporter } from "./mailer";
import { leadEmailTemplate } from "./templates";

export const sendLeadEmail = async ({
  agentEmail,
  lead,
  property,
}) => {
  try {
    await transporter.sendMail({
      from: `"NestMe" <${process.env.EMAIL_USER}>`,
      to: agentEmail,
      subject: `New Lead for ${property.title}`,
      html: leadEmailTemplate({ property, lead }),
    });
  } catch (error) {
    console.error("Lead Email Error:", error);
  }
};
