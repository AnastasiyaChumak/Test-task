import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
    const token = req.cookies.get("authjs.session-token") ?? 
                  req.cookies.get("__Secure-authjs.session-token")
    
    if (!token && req.nextUrl.pathname.startsWith("/game")) {
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }
}

export const config = {
    matcher: ["/game/:path*"],
}