import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import { request } from "http";


// GET Request - Fetch all users
export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("GET Error:", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

// POST Request - Creating a new user
export const POST = async (req: { json: () => any; }) => {
    try {
        await connect(); // Connect to MongoDB

        // Get JSON data from request body
        const body = await req.json();
        console.log("Received body:", body);

        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: body.email }, { username: body.username }] 
        });

        if (existingUser) {
            return new NextResponse(
                JSON.stringify({ message: "User with this email or username already exists!" }), 
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create a new user
        const newUser = new User({
            title: body.title,
            email: body.email,
            number: body.number,
            username: body.username,
        });

        console.log("New user object:", newUser);

        // Save the user to the database
        await newUser.save();

        return new NextResponse(
            JSON.stringify({ message: "User created successfully!", user: newUser }), 
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("POST Error:", error);

        // Handle duplicate key error (MongoDB code 11000)
        if (error.code === 11000) {
            return new NextResponse(
                JSON.stringify({ message: "Duplicate key error: Email or username already exists!" }), 
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }), 
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};




export const PUT = async (req) => {
    try {
        await connect();
        const { objectId, email, ...updateData } = await req.json();

        if (!objectId && !email)
            return NextResponse.json({ message: "Email or id is required!" }, { status: 400 });

        if (objectId && !mongoose.Types.ObjectId.isValid(objectId))
            return NextResponse.json({ message: "Invalid ObjectId!" }, { status: 400 });

        const existingUser = await User.findOne({ 
            $or: [{ email }, { _id: objectId ? new mongoose.Types.ObjectId(objectId) : null }] 
        });

        if (!existingUser)
            return NextResponse.json({ message: "User not found!" }, { status: 404 });

        const updatedUser = await User.findByIdAndUpdate(existingUser._id, updateData, { new: true });

        return NextResponse.json({ message: "User updated!", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = async (req) => {
    try {
        await connect();

        const { searchParams } = new URL(req.url);  // Use req instead of request
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "User ID is required!" }, { status: 400 });
        }

        // Example: Assuming you have a method to find and delete the user.
        const deletedUser = await User.findByIdAndDelete(userId); // Replace with your actual delete method

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully!" }, { status: 200 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

