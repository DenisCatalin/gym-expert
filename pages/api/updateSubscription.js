import { updateSubscription } from "../../lib/db/hasura";

export default async function UpdateSubscription(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const planName = req ? JSON.parse(req.headers.body).paidPlan : null;
      const planExpireDate = req ? JSON.parse(req.headers.body).planExpireDate : null;
      const subscribedIn = req ? JSON.parse(req.headers.body).subscribedIn : null;

      const updateSubscriptionForUser = await updateSubscription(
        token,
        issuer,
        planName,
        planExpireDate,
        subscribedIn
      );

      res.send({ message: "Complete", updateSubscriptionForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
