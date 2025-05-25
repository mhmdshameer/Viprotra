import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { connectToMongoDB } from "../../../../lib/mongodb";
import VideoProgress from "../../../../models/videoProgress";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();

    const allProgress = await VideoProgress.find({ userId: session.user.id });
    
    let totalWatchedTime = 0;
    let totalDuration = 0;

    allProgress.forEach(progress => {
      const progressData = progress.calculateProgress();
      totalWatchedTime += (progressData / 100) * progress.totalDuration;
      totalDuration += progress.totalDuration;
    });

    const totalProgress = totalDuration > 0 ? (totalWatchedTime / totalDuration) * 100 : 0;

    return NextResponse.json({ totalProgress: Math.round(totalProgress) });
  } catch (error) {
    console.error("Error fetching total progress:", error);
    return NextResponse.json(
      { error: "Error fetching total progress" },
      { status: 500 }
    );
  }
} 