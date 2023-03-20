import { getTransactionHistoryQuery } from "../../lib/db/hasura";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const token = req ? req.cookies?.token : null;
      //@ts-ignore
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const transactionHistory = await getTransactionHistoryQuery(token, issuer);

      res.send({ done: true, transactionHistory });
    } catch (error) {
      console.error("Something went wrong getting the transaction history", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
