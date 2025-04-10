import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, fullname: user.fullname },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

export default generateToken;
