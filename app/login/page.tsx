import { Metadata } from "next";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

export default function Page() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
