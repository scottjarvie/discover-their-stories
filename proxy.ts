import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
  "/api/people(.*)",
  "/api/import(.*)",
  "/api/process(.*)",
  "/api/convex(.*)",
]);

const hasClerkKeys = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const legacyHosts = new Set([
  "tell-their-stories.vercel.app",
  "tell-their-stories-jarvies-projects.vercel.app",
  "tell-their-stories-jarvie-jarvies-projects.vercel.app",
]);

const authMiddleware = clerkMiddleware(
  async (auth, req) => {
    if (legacyHosts.has(req.nextUrl.host)) {
      const redirectUrl = new URL(req.url);
      redirectUrl.protocol = "https:";
      redirectUrl.host = "discovertheirstories.com";
      return NextResponse.redirect(redirectUrl, 308);
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  }
);

export default hasClerkKeys
  ? authMiddleware
  : function proxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
