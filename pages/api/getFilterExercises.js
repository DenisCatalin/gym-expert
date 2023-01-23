import { getFavouritesByFilterQuery } from "../../lib/db/hasura";

export default async function getFavourites(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const filter = req ? JSON.parse(req.headers.body).filter : null;

      const getFilteredExercises = await getFavouritesByFilterQuery(token, issuer, filter);

      res.send({ message: "Complete", getFilteredExercises });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
