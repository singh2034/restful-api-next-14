import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

// GET request for getting the existed blogs in db
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page: any = parseInt(searchParams.get("page") || "1");
    const limit: any = parseInt(searchParams.get("limit") || "10");

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
    // find the userId
    const user = await User.findById(userId);
    // validation for user
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found" }), {
        status: 404,
      });
    }
    // find the categoryId
    const category = await Category.findOne({ _id: categoryId, user: userId });
    // validation for category
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    // filter, sorting or pagination for frontend etc
    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };
    // validation for search keywords
    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }
    const skip = (page - 1) * limit;
    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);
    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

// POST || creating the posts for blogs
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    // const blogId = searchParams.get("blogId");
    const body = await request.json();
    const { title, description } = body;
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
    // find the userId
    const user = await User.findById(userId);
    // validation for user
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found" }), {
        status: 404,
      });
    }
    // find the categoryId
    const category = await Category.findOne({ _id: categoryId, user: userId });
    // validation for category
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    // create new blog
    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });
    await newBlog.save();
    return new NextResponse(
      JSON.stringify({
        message: "Blog is created",
        blog: newBlog,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};
