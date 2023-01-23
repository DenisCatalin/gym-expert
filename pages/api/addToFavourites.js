import { addToFavouritesQuery } from "../../lib/db/hasura";

export default async function addToFavourites(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const gif = req ? JSON.parse(req.headers.body).gif : null;
      const name = req ? JSON.parse(req.headers.body).name : null;
      const category = req ? JSON.parse(req.headers.body).category : null;

      console.log("categ", category);

      const addToFavouritesForUser = await addToFavouritesQuery(token, issuer, gif, name, category);

      res.send({ message: "Complete", addToFavouritesForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
