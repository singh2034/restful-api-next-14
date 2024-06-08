import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
  } catch (err) {
    console.log("error: ", err);
  }
  return new NextResponse("This is my api");
};
