import express from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get the users from the data base
    const users = await getUsers();
    // Return the response
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    // Get the user from the current id
    const deletedUser = await deleteUserById(id);
    // Return the response
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    // Validate if there is there any username to update
    if (!username) {
      return res.sendStatus(400);
    }
    // Get the user from the current id
    const user = await getUserById(id);
    // Asign the user's username to the new username
    user.username = username;
    // Save the request
    await user.save();
    // Return the response
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
