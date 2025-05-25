import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { connectToMongoDB } from "../../../lib/mongodb"
import User from "../../../models/user"

export async function POST(req: Request) {
    try {
        const { username, password} = await req.json()
        const hashedPassword = await bcrypt.hash(password, 10)

        await connectToMongoDB()
        await User.create({username, password:hashedPassword})

        return NextResponse.json({message: "User created successfully"})
    } catch (error) {
        return NextResponse.json({message: "User creation failed"}, {status: 500})
    }
}