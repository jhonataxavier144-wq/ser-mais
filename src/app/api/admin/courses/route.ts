import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...courseData } = body; // strip any incoming ID

  try {
    const courseRef = await adminDb.collection("courses").add({
      ...courseData,
      published: courseData.published !== false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: courseRef.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar curso" }, { status: 500 });
  }
}
