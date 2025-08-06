"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getEmployee } from "@/app/lib/data";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().trim()
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    const employee = await getEmployee(email);
    if (!employee) {
        return {
            errors: {
                email: ["Invalid email or password"],
            },
        };
    }


    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
        return {
            errors: {
                email: ["Invalid email or password"],
            },
        };
    }
    await createSession(String(employee.id));

    redirect("/dashboard");

}


export async function logout() {
    await deleteSession();
    redirect("/login");
}