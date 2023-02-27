import { getTestimonialsQuery } from "../../lib/db/hasura";

export default async function GETTestimonial(req, res) {
  if (req.method === "GET") {
    try {
      const token = req ? req.cookies?.token : null;

      const getTestimonialsForUser = await getTestimonialsQuery(token);

      res.send({ message: "Complete", getTestimonialsForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
