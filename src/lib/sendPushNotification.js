import { messaging } from "@/lib/firebaseAdmin";

export const sendPushNotification = async (tokens, { title, body }) => {
  if (!tokens || tokens.length === 0) {
    console.log("No FCM tokens found");
    return;
  }

  try {
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    });

    console.log(
      `Push sent: ${response.successCount}/${tokens.length} successful`,
    );

    if (response.failureCount > 0) {
      response.responses.forEach((res, index) => {
        if (!res.success) {
          console.error(`Failed token (${tokens[index]}):`, res.error?.message);
        }
      });
    }
  } catch (err) {
    console.error("FCM Error:", err);
  }
};
