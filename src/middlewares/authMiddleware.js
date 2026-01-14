
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) 
//     return res.status(401).json({ msg: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthorized = async (req, res, next) => {
  try {
    const { auth } = req.headers;
    if (!auth) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Authorization header missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(auth, "secret");
    if (!decoded) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Invalid or expired token, please log in again",
      });
    }

// Find user
    const user = await User.findById(decoded?.data?._id);
    //console.log("=====>",user);
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found, please create account again",
      });
    }

    // Attach user to request
    req._user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Unauthorized access",
      error: err.message,
    });
  }
};

module.exports = {
  isAuthorized,
}