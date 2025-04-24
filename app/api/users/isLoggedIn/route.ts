import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    // const token = req.headers.get("authorization")?.split(" ")[1];
    const token=req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error occurred" }, { status: 500 });
  }
}
