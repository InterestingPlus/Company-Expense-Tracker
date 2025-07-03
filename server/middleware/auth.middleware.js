import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, admin) => {
      if (error) {
        return res.sendStatus(403);
      }

      req.admin = admin;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};
