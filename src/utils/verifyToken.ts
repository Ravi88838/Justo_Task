import jwt from "jsonwebtoken";
const verifyToken = (access_token: string) => {
  try {
    const token = jwt.verify(access_token, process.env.JWT_SECRET!);

    return token;
  } catch (error: any) {}
};

export default verifyToken;
