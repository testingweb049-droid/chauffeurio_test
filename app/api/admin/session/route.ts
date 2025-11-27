import { NextRequest, NextResponse } from "next/server";
import { getAdminCookie } from "@/lib/auth/cookies";
import { validateAdminSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const token = getAdminCookie(request);

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const session = await validateAdminSession(token);

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: session.adminId,
        email: session.email,
        name: session.name,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: "An error occurred",
      },
      { status: 500 }
    );
  }
}

