import { messaging } from "../lib/firebaseAdmin";

export const sendPushNotification = async (
  tokens,
  { title, body, data = {} },
) => {
  if (!tokens?.length) {
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

      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          String(value),
        ]),
      ),

      android: {
        priority: "high",
        notification: {
          channelId: "default",
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
      `✅ Push sent: ${response.successCount}/${tokens.length} successful`
    );

    response.responses.forEach((res, index) => {
      if (!res.success) {
        console.error(
          `❌ Failed token (${tokens[index]}):`,
          res.error?.message
        );
      }
    });

  } catch (err) {
    console.error("FCM Error:", err);
  }
};