import { forgotKeywordQuery } from "../../lib/db/hasura";

export default async function forgotKeyword(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const email = req ? JSON.parse(req.headers.body).email : null;

      const forgotKeywordForUser = await forgotKeywordQuery(token, email);

      res.send({ message: "Complete", forgotKeywordForUser });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
