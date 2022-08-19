import { addTestimonialToUserQuery } from "../../lib/db/hasura";

export default async function AddTestimonial(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;

      const addTestimonialForUser = await addTestimonialToUserQuery(
        token,
        issuer
      );

      res.send({ message: "Complete", addTestimonialForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
