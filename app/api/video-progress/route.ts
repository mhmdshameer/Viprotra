import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { connectToMongoDB } from "../../../lib/mongodb";
import VideoProgress from "../../../models/videoProgress";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoPath, lastPosition, totalDuration, watchedIntervals } = await req.json();

    await connectToMongoDB();

    const videoProgress = await VideoProgress.findOneAndUpdate(
      { userId: session.user.id, videoPath },
      {
        $set: {
          lastPosition,
          totalDuration,
          lastWatched: new Date(),
          watchedIntervals,
        },
      },
      { upsert: true, new: true }
    );

    // Calculate progress based on watched intervals
    const progress = videoProgress.calculateProgress();

    return NextResponse.json({ ...videoProgress.toObject(), progress });
  } catch (error) {
    console.error("Error saving video progress:", error);
    return NextResponse.json(
      { error: "Error saving video progress" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const videoPath = searchParams.get("videoPath");

    if (!videoPath) {
      return NextResponse.json(
        { error: "Video path is required" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const videoProgress = await VideoProgress.findOne({
      userId: session.user.id,
      videoPath,
    });

    if (!videoProgress) {
      return NextResponse.json({ 
        progress: 0, 
        lastPosition: 0, 
        watchedIntervals: [],
        totalDuration: 0 
      });
    }

    const progress = videoProgress.calculateProgress();
    return NextResponse.json({ ...videoProgress.toObject(), progress });
  } catch (error) {
    console.error("Error fetching video progress:", error);
    return NextResponse.json(
      { error: "Error fetching video progress" },
      { status: 500 }
    );
  }
} 