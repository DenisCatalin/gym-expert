import { SetCroppedAreaQuery } from "../../lib/db/hasura";

export default async function SetCropArea(req, res) {
  if (req.method === "POST") {
    try {
      const token = req ? req.cookies?.token : null;
      const displayName = req ? JSON.parse(req.headers.body).displayName : null;
      const cropArea = req ? JSON.parse(req.headers.body).cropArea : null;

      const SetCroppedArea = await SetCroppedAreaQuery(
        token,
        displayName,
        cropArea
      );

      res.send({ message: "Complete", SetCroppedArea });
    } catch (error) {
      console.error("Something went wrong adding the purchase", error);
      res.status(500).send({ message: "Incomplete" });
    }
  } else {
    res.send({ message: "Incomplete" });
  }
}
