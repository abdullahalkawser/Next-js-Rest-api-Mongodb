import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

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
