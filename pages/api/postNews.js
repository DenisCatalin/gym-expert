import { postNewsQuery } from "../../lib/db/hasura";

export default async function PostNews(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const title = req ? JSON.parse(req.headers.body).title : null;
      const text = req ? JSON.parse(req.headers.body).text : null;
      const img = req ? JSON.parse(req.headers.body).img : null;
      const date = req ? JSON.parse(req.headers.body).date : null;

      const postNews = await postNewsQuery(token, title, text, img, date);

      res.send({ message: "Complete", postNews });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
