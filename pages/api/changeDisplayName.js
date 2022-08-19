import { ChangeDisplayNameQuery } from "../../lib/db/hasura";

export default async function ChangeDisplayName(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const newName = req ? JSON.parse(req.headers.body).newName : null;

      const ChangeDisplayNameQueryForUser = await ChangeDisplayNameQuery(
        token,
        issuer,
        newName
      );

      res.send({ message: "Complete", ChangeDisplayNameQueryForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
