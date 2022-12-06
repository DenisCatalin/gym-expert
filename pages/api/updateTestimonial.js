import { updateTestimonialQuery } from "../../lib/db/hasura";

export default async function UpdateTestimonial(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const displayName = req ? JSON.parse(req.headers.body).displayName : null;
      const date = req ? JSON.parse(req.headers.body).date : null;
      const text = req ? JSON.parse(req.headers.body).text : null;
      const rating = req ? JSON.parse(req.headers.body).rating : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;

      const updateTestimonial = await updateTestimonialQuery(token, date, text, rating, issuer);

      res.send({ message: "Complete", updateTestimonial });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
