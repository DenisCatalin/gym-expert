import { getPopularNewsQuery } from "../../lib/db/hasura";

export default async function GetNews(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;

      const getPopularNewsForUser = await getPopularNewsQuery(token);

      res.send({ message: "Complettte", getPopularNewsForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
