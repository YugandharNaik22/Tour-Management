import express from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = "hxyyxt6eoAxuio7590kjkjzdytincx52gzHA$kjxQyg";

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized!" });
  }

  console.log('Received Token:', token);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);

      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ success: false, message: "Token has expired" });
      }

      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    console.log('Decoded User:', user);

    req.user = user;
    next(); // call next
  })
  
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.role === "admin")) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're not authenticated" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're not authorized" });
    }
  });
};
