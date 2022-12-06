import { checkDisplayNameQuery } from "../../lib/db/hasura";

export default async function CheckDisplayName(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const newName = req ? JSON.parse(req.headers.body).newName : null;

      const CheckDisplayNameQueryForUser = await checkDisplayNameQuery(token, newName);

      res.send({ message: "Complete", CheckDisplayNameQueryForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
