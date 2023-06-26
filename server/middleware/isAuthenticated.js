require("dotenv").config(); // loads contents of .env into process.env by default
const jwt = require("jsonwebtoken"); 
const { SECRET } = process.env; 

module.exports = {
  isAuthenticated: (req, res, next) => {
    const headerToken = req.get("Authorization"); // pulls the authorization value off of the request

    if (!headerToken) {
      console.log("ERROR IN auth middleware");
      res.sendStatus(401);
    } // if the token returns false, send status code 401 error (access denied)

    let token; // set up the token variable to use later

    try {
      token = jwt.verify(headerToken, SECRET); // verifies that the token matches the key and sets that truthy/falsy value to the token variable 
    } catch (err) {
      err.statusCode = 500;
      throw err;
      // if the token doesn't come back valid, throws status code 500 error (internal server error)
    }

    if (!token) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;

      // if the token returns false, throws status code 401 error (access denied)
    }

    next(); // would move on to next middleware
  },
};
