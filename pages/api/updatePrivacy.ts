import { updatePrivacyQuery } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function updatePrivacy(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      //@ts-ignore
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      //@ts-ignore
      const privacy = req ? JSON.parse(req.headers.body).privacy : null;
      //@ts-ignore
      const data = await updatePrivacyQuery(token, issuer, JSON.stringify(privacy));

      res.send({ done: true, data });
    } catch (error) {
      console.error("Something went wrong getting the user details", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
