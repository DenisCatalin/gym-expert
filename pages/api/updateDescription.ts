import { updateDescriptionQuery } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function updateLinks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      //@ts-ignore
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      //@ts-ignore
      const description = req ? JSON.parse(req.headers.body).description : null;
      //@ts-ignore
      const data = await updateDescriptionQuery(token, issuer, description);

      res.send({ done: true, data });
    } catch (error) {
      console.error("Something went wrong getting the user details", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
