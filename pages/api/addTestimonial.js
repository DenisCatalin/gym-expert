import { addTestimonialQuery } from "../../lib/db/hasura";

export default async function AddTestimonial(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const displayName = req ? JSON.parse(req.headers.body).displayName : null;
      const date = req ? JSON.parse(req.headers.body).date : null;
      const text = req ? JSON.parse(req.headers.body).text : null;
      const rating = req ? JSON.parse(req.headers.body).rating : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;

      const addTestimonialForUser = await addTestimonialQuery(
        token,
        displayName,
        date,
        text,
        rating,
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
