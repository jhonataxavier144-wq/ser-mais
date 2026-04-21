import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, nascimento, genero, cidade, estado, origem } = await req.json();
  const userId = (session.user as any).id;

  try {
    await adminDb.collection("users").doc(userId).update({
      name,
      nascimento: nascimento ? new Date(nascimento) : null,
      genero,
      cidade,
      estado,
      origem,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
