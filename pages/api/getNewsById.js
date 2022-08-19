import { getNewsByIdQuery } from "../../lib/db/hasura";

export default async function GetNews(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const id = req ? JSON.parse(req.headers.body).id : null;

      const getNewsByIdForUser = await getNewsByIdQuery(token, id);

      res.send({ message: "Complettte", getNewsByIdForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
