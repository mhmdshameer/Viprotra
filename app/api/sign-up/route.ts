import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { username, password} = await req.json()

        console.log("Creating user:", username, password)

        return NextResponse.json({message: "User created successfully"})
    } catch (error) {
        return NextResponse.json({message: "User creation failed"}, {status: 500})
    }
}