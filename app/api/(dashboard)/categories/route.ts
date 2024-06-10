import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { stringify } from "querystring";

// GET categories Request || getting the existing categories
export const GET = async (request: Request) => {
  try {
    // getting the existing user for existing categories
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing userID",
        }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found in the database",
        }),
        { status: 400 }
      );
    }
    // getting the existing categories with the existing users
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    // status
    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching categories" + error.message, {
      status: 500,
    });
  }
};
