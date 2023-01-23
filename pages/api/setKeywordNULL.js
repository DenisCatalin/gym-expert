import { setSecretKeywordNULLQuery } from "../../lib/db/hasura";

export default async function setSecretKeywordNULL(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;

      const setSecretKeyword = await setSecretKeywordNULLQuery(token, issuer);

      res.send({ message: "Complete", setSecretKeyword });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
