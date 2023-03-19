import { addPurchaseQuery } from "../../lib/db/hasura";

export default async function AddPurchase(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const planName = req ? JSON.parse(req.headers.body).planName : null;
      const planPrice = req ? JSON.parse(req.headers.body).planPrice : null;
      const paymentId = req ? JSON.parse(req.headers.body).paymentId : null;
      const email = req ? JSON.parse(req.headers.body).email : null;
      const date = req ? JSON.parse(req.headers.body).date : null;
      const forUser = req ? JSON.parse(req.headers.body).forUser : null;

      const addPurchaseForUser = await addPurchaseQuery(
        token,
        issuer,
        planName,
        planPrice,
        paymentId,
        email,
        date,
        forUser
      );

      res.send({ message: "Complete", addPurchaseForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
