import { checkFavouriteQuery } from "../../lib/db/hasura";

export default async function CheckFavourite(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const gif = req ? JSON.parse(req.headers.body).gif : null;

      const checkFavouriteQueryForUser = await checkFavouriteQuery(
        token,
        issuer,
        gif
      );

      res.send({ message: "Complete", checkFavouriteQueryForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
