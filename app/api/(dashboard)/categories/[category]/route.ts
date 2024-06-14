import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// updating the existing category based on previous user
export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    // fetching the title from the body
    const { title } = body;
    // recieve the ID from search params or user search box
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    // validation
  } catch (error: any) {
    return new NextResponse("Error in updating the category" + error.message, {
      status: 500,
    });
  }
};
