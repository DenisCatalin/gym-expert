import { SetKeywordQuery } from "../../lib/db/hasura";

export default async function SetKeyword(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const keyword = req ? JSON.parse(req.headers.body).keyword : null;

      const SetKeywordQueryForUser = await SetKeywordQuery(token, issuer, keyword);

      res.send({ message: "Complete", SetKeywordQueryForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
