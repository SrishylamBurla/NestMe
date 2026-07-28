import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/sendPushNotification";
import { sendEmail } from "@/lib/sendEmail";

export async function notifyUser({
  userId,
  title,
  message,
  type,
  entityId = null,
  priority = "medium",
  link = "",
  sendMail = false,
  emailSubject,
  emailHtml,
}) {
  // Save notification
  await Notification.create({
    user: userId,
    title,
    message,
    type,
    entityId,
    priority,
    link,
  });

  const user = await User.findById(userId);

  // Push Notification
  if (user?.fcmTokens?.length) {
    await sendPushNotification(user.fcmTokens, {
      title,
      body: message,
      data: {
        type,
        entityId: entityId?.toString() || "",
        link,
      },
    });
  }

  // Email
  if (sendMail && user?.email) {
    await sendEmail({
      to: user.email,
      subject: emailSubject || title,
      html: emailHtml,
    });
  }
}