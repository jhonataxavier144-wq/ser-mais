"use server";

import { adminDb } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos" };
  }

  const usersRef = adminDb.collection("users");
  const existingUser = await usersRef.where("email", "==", email).get();

  if (!existingUser.empty) {
    return { error: "Este email já está cadastrado" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await usersRef.add({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      nivel: 1,
      xp: 0,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    return { error: "Erro ao criar conta" };
  }
}
