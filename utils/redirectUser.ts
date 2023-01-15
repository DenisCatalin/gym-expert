import { verifyToken } from "../lib/utils";

type IContext = {
  context?: any;
}

const UseRedirectUser = async ({context} : IContext) => {
  const token = context.req ? context.req.cookies?.token : null;

  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};

export default UseRedirectUser;
