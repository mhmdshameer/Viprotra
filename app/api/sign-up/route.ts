import { NextResponse } from "next/server"
import { connectToMongoDB } from "../../../lib/mongodb"
import User from "../../../models/user"
import bcrypt from "bcryptjs"

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      )
    }

    await connectToMongoDB()
    
    // Check if user exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
     await User.create({
      username,
      password: hashedPassword,
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Sign-up error:", error)
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    )
  }
}