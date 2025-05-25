import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

interface SignUpRequest {
  username: string;
  password: string;
}

interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}

export async function POST(req: Request) {
  try {
    const { username, password }: SignUpRequest = await req.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    await connectToMongoDB()
    
    // Check if user exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      username,
      password: hashedPassword,
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in sign-up:", error)
    const validationError = error as ValidationError
    const mongoError = error as MongoError

    if (validationError.errors) {
      return NextResponse.json(
        { error: Object.values(validationError.errors)[0].message },
        { status: 400 }
      )
    }

    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    )
  }
}