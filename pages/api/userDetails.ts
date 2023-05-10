import { getUserDetailsQuery } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const token = req && typeof req.cookies?.token === 'string' ? req.cookies.token : '';
      const secretKey = process.env.SECRET_KEY_HASURA || '';
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
      const userDetails = await getUserDetailsQuery(token, decodedToken?.issuer || '');

      res.send({ done: true, userDetails });
    } catch (error) {
      console.error("Something went wrong getting the user details", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
