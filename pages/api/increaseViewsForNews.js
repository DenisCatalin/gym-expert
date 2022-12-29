import { increaseViewsForPostQuery } from "../../lib/db/hasura";

export default async function IncreaseViews(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const id = req ? JSON.parse(req.headers.body).id : null;
      const views = req ? JSON.parse(req.headers.body).views : null;

      const increaseViews = await increaseViewsForPostQuery(token, id, views);

      res.send({ message: "Complettte", increaseViews });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
