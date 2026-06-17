import AgentProfile from '@/models/AgentProfile'
import Subscription from '@/models/Subscription';

export async function activateSubscription(user) {

    user.role = 'agent';
    let agent = await AgentProfile.findOne({
        user: user._id
    });

    if (!agent) {
        agent = await AgentProfile.create({
            user: user._id
        });
    }
    user.agentProfileId = agent._id;
    let subscription = await Subscription.findOne({
        user: user._id
    });
    if (subscription) {
        const now = new Date();
        const baseDate =
            subscription.endDate &&
                new Date(subscription.endDate) > now ? new Date(subscription.endDate) : now;

        const endDate = new Date(baseDate);
        endDate.setMonth(
            endDate.getMonth() + 1
        );
        subscription.plan = 'basic';
        subscription.status = 'active';
        subscription.price = 999;
        subscription.startDate = now;
        subscription.endDate = endDate;
        await subscription.save();
    }
    else {
        subscription = await Subscription.create({
            user: user._id,
            plan: 'basic',
            price: 999,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            )
        });
    }

    user.subscriptionId = subscription._id;

    await user.save();
    return {
        agent,
        subscription
    };

}


