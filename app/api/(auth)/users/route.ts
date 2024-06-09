import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

// GET user request
export const GET = async () => {
  // getting the user data from the DB
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

// POST user request
export const POST = async (request: Request) => {
  // creating new user and saving its data in DB
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "New User is Created", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating new user" + error.message, {
      status: 500,
    });
  }
};

// PATCH user request
export const PATCH = async (request: Request) => {
  // updating the existing user data in the DB
  try {
    const body = await request.json();
    const { userId, newUserName } = body;

    await connect();
    // checking for existing user
    if (!userId || !newUserName) {
      return new NextResponse(
        JSON.stringify({
          message: "ID or new username not found",
        }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid User ID",
        }),
        { status: 400 }
      );
    }
    // finding the user and updating the data
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        userName: newUserName,
      },
      {
        new: true,
      }
    );
    // error for user not found
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found in the database",
        }),
        { status: 400 }
      );
    }
    // user updated successfully
    return new NextResponse(
      JSON.stringify({
        message: "User is updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};
