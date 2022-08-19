import { getUserDetailsQuery } from "../../lib/db/hasura";
import jwt from "jsonwebtoken";

export default async function getUserDetails(req, res) {
  if (req.method === "GET") {
    try {
      const token = req ? req.cookies?.token : null;
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY_HASURA);
      const userDetails = await getUserDetailsQuery(token, decodedToken.issuer);

      res.send({ done: true, userDetails });
    } catch (error) {
      console.error("Something went wrong getting the user details", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
