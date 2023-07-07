require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const { User } = require("../models/user");

const createToken = (username, id) => {
  return jwt.sign({ username, id }, SECRET, {
    expiresIn: "2 days",
  });
};

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      let foundUser = await User.findOne({ where: { username: username } });

      if (foundUser) {
        res.status(400).send("User already exists");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
          username,
          hashedPass: hash,
        });

        console.log(newUser);

        const token = createToken(
          newUser.dataValues.username,
          newUser.dataValues.id
        );
        const exp = Date.now() + 1000 * 60 * 60 * 48;

        res.status(200).send({
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token,
          exp,
        });
      }
    } catch (err) {
      console.log("Registration error");
      console.log(err);
      res.sentStatus(400);
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      let foundUser = await User.findOne({ where: { username: username } });

      if (foundUser) {
        const isAuthenticated = bcrypt.compareSync(
          password,
          foundUser.hashedPass
        );

        if (isAuthenticated) {
          const token = createToken(
            foundUser.dataValues.username,
            foundUser.dataValues.id
          );
          const exp = Date.now() + 1000 * 60 * 60 * 48;
          res.status(200).send({
            username: newUser.dataValues.username,
            userId: newUser.dataValues.id,
            token,
            exp,
          });
        } else {
          console.log("Cannot login");
        }
      } else {
        console.log("Cannot login");
      }
    } catch (err) {
        console.log("Login error");
        console.log(err);
        res.sentStatus(400);
    }
  },
};
