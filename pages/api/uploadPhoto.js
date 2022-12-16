import { changeNewProfilePicQuery } from "../../lib/db/hasura";

export default async function uploadPhoto(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const displayName = req ? JSON.parse(req.headers.body).displayName : null;
      const profilePic = req ? JSON.parse(req.headers.body).profilePic : null;
      const issuer = req ? JSON.parse(req.headers.body).issuer : null;
      const changes = await changeNewProfilePicQuery(token, displayName, profilePic, issuer);
      console.log("from here: ", profilePic);

      res.send({ done: true, changes });
    } catch (error) {
      console.error("Something went wrong getting the comments for photo", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
