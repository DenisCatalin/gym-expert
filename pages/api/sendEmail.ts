import type { NextApiRequest, NextApiResponse } from "next";

const mail = require('@sendgrid/mail');

const defaultEmail = 'gym.expert.app@gmail.com';
mail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
  //@ts-ignore
  const email = req ? JSON.parse(req.headers.body).email : null;
  //@ts-ignore
  const subject = req ? JSON.parse(req.headers.body).subject : null;
  //@ts-ignore
  const message = req ? JSON.parse(req.headers.body).message : null;
  //@ts-ignore
  const type = req ? JSON.parse(req.headers.body).type : null;


  if(type === "contact") {
    await mail.send({
      to: defaultEmail,
      from: defaultEmail,
      subject: subject,
      text: message,
      html: message.replace(/\r\n/g, '<br>'),
    });
  } else {
    await mail.send({
      to: email,
      from: defaultEmail,
      subject: subject,
      text: message,
      html: message.replace(/\r\n/g, '<br>'),
    });
  }

  res.status(200).json({ status: 'Ok' });
  }
  catch(err) {
    console.log(err);
    res.status(400).json({ status: 'Error' });
  }
}
