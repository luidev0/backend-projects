import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.sendStatus(400);
    }
    // Validate for existing user data
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    // Validation
    if (!user) {
      return res.sendStatus(400);
    }
    // Validate HASH
    const expectedHash = authentication(user.authentication.salt, password);
    // Validation
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }
    // Create a new sal random number
    const salt = random();
    // Give a sessionToken using auth and a new salt value
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    // Save logging
    await user.save();
    // Session token
    res.cookie("LUIGUI-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    // Return response
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    // Validation
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    // Validate for existing user data
    const existingUser = await getUserByEmail(email);
    // Validation
    if (existingUser) {
      return res.sendStatus(400);
    }
    // Create a random key
    const salt = random();
    // Create user passing the correct data
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    // Return a success message
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

