import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// updating the existing category based on previous user
export const PATCH = async (request: Request, context: { params: any }) => {
  // it will fetch dynamically from params []
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    // fetching the title from the body
    const { title } = body;
    // recieve the ID from search params or user search box
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // validation for userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing userId" }),
        {
          status: 400,
        }
      );
    }
    // validation for categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing categoryId" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    // validation for user
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    // validation for category
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    // checking for error and updating
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "Category is updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating the category" + error.message, {
      status: 500,
    });
  }
};

// Deleting the existing category based on existing user
export const DELETE = async (request: Request, context: { params: any }) => {
  // it will fetch dynamically from params []
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // validation for userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing userId" }),
        {
          status: 400,
        }
      );
    }
    // validation for categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing categoryId" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    // validation for user
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    // validation for category
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    // deleting the category
    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(
      JSON.stringify({
        message: "Category is deleted",
        categoryId,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting the category" + error.message, {
      status: 500,
    });
  }
};
