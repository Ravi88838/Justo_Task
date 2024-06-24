import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string, time: string = "30m") => {
  try {
    const token = jwt.sign(
      { id: String(id), role: role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: time,
      }
    );
    return token;
  } catch (error: any) {}
};

export default generateToken;
