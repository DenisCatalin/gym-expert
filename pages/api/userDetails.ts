import { getUserDetailsQuery } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import jwt from "jsonwebtoken";

export default async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const token = req ? req.cookies?.token : null;
      //@ts-ignore
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
