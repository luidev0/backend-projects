import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    // Validate if there isn't a current user id
    if (!currentUserId) {
      return res.sendStatus(403);
    }
    // Validate if the current user id is equal to the param id
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }
    // Return the middleware action app
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["LUIGUI-AUTH"];
    // Validation
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    // If existing user is current active
    const existingUser = await getUserBySessionToken(sessionToken);
    // Validation
    if (!existingUser) {
      return res.sendStatus(403);
    }
    // Using merge from lodash
    merge(req, { identity: existingUser });
    // Return next
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
