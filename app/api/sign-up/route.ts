import { NextResponse } from "next/server"
import { connectToMongoDB } from "../../../lib/mongodb"
import User from "../../../models/user"
import bcrypt from "bcryptjs"

interface SignUpRequest {
  username: string;
  password: string;
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
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    )
  }
}