import Subscription from "../models/Subscription.js";

export async function checkSubscription(user) {
  const subscription =
    await Subscription.findOne({
      user: user._id,
    });

  if (!subscription) return;

  const expired =
    subscription.endDate &&
    new Date(subscription.endDate) <
      new Date();

  if (
    expired &&
    subscription.status !== "expired"
  ) {
    subscription.status = "expired";
    await subscription.save();

    user.role = "user";
    await user.save();
  }
}