import { getNewsByNameQuery } from "../../lib/db/hasura";

export default async function GetNewsByName(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const name = req ? JSON.parse(req.headers.body).name : null;

      const getNewsByNameForUser = await getNewsByNameQuery(token, name);

      res.send({ message: "Complettte", getNewsByNameForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
