import type { NextApiRequest, NextApiResponse } from "next";
import schedule from 'node-schedule';

const mail = require('@sendgrid/mail');

const defaultEmail = 'gym.expert.app@gmail.com';
mail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {

  //@ts-ignore
  const email = req ? JSON.parse(req.headers.body).email : null;
  //@ts-ignore
  const message = req ? JSON.parse(req.headers.body).message : null;
  //@ts-ignore
  const scheduledDate = req ? JSON.parse(req.headers.body).scheduledDate : null;

  try {
  schedule.scheduleJob(scheduledDate, async () => {
      try {
          await mail.send({
            to: email,
            from: defaultEmail,
            subject: "You have scheduled a set of exercises",
            text: message,
            html: message.replace(/\r\n/g, '<br>'),
          });
      }
      catch(err) {
          console.log(err);
      }
  })

  res.status(200).json({ status: 'Ok' });
  }
  catch(err) {
    console.log(err);
    res.status(400).json({ status: 'Error' });
  }
}
