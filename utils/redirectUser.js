import { verifyToken } from "../lib/utils";

const UseRedirectUser = async context => {
  const token = context.req ? context.req.cookies?.token : null;

  console.log(context);

  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};

export default UseRedirectUser;
