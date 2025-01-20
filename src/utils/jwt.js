import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key"; // Cambia esto por una clave segura

export const generateToken = (user) => {
  return jwt.sign({ uid: user.uid, email: user.email, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
