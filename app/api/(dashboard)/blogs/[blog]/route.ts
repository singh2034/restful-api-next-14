import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

// GET a SINGLE BLOG
export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
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
    // validation for dyanimic blog
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing blogId" }),
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
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    // validation for blog existent
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching a blog" + error.message, {
      status: 500,
    });
  }
};

// UDPATE A SINGLE BLOG
export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;
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

    // validation for dyanimic blog
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing blogId" }),
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
    // validation for blog existent
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "Blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating a blog" + error.message, {
      status: 500,
    });
  }
};

// DELETE a single BLOG
export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

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

    // validation for dyanimic blog
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing blogId" }),
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
    // validation for blog existent
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    await Blog.findByIdAndDelete(blogId);
    // response
    return new NextResponse(
      JSON.stringify({
        message: "Blog is Deleted",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting a blog" + error.message, {
      status: 500,
    });
  }
};
