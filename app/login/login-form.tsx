"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export default function LoginForm() {
    const [state, loginAction] = useActionState(login, {errors: {}});


    return (
        <form action={loginAction}>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mt-4">
                {state?.errors?.email && (
                    <p className="text-red-500 text-sm">{state.errors.email}</p>
                )}
                {state?.errors?.password && (
                    <p className="text-red-500 text-sm">{state.errors.password}</p>
                )}
            </div>

            <div className="mt-4">
                <SubmitButton />
            </div>
        </form>
    );
}


function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
            {pending ? "Logging in..." : "Login"}
        </button>
    );


}