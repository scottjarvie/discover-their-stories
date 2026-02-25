import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
        <p className="max-w-md text-center text-sm text-stone-600">
          Sign-up is not configured yet. Add Clerk environment variables to enable authentication.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <SignUp />
    </div>
  );
}
