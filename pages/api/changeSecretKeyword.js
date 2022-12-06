import { ChangeSecretKeywordQuery } from "../../lib/db/hasura";

export default async function ChangeSecretKeyword(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const newSecretKeyword = req ? JSON.parse(req.headers.body).newSecretKeyword : null;

      const ChangeSecretKeywordForUser = await ChangeSecretKeywordQuery(
        token,
        issuer,
        newSecretKeyword
      );

      res.send({ message: "Complete", ChangeSecretKeywordForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
