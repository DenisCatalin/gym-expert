import { getUsersDisplayName } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const token = req ? req.cookies?.token : null;
      //@ts-ignore
      const names = await getUsersDisplayName(token);

      res.send({ done: true, names });
    } catch (error) {
      console.error("Something went wrong getting the user details", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
