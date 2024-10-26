import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  // 1. Read the token.
  const token = req.cookies.token;

  // 2. if no token, return the error.
  if (!token) {
    return res.status(401).json({ msg: "Unauthorized Access" });
  }
  // 3. check if token is valid.
  try {
    const payload = jwt.verify(token, "postwayProject2");
    req.userId = payload.userId;
  } catch (err) {
    // 4. return error.
    console.log(err);
    return res.status(401).json({ msg: "Unauthorized Access" });
  }

  // 5. call next middleware.
  next();
};

export default jwtAuth;
