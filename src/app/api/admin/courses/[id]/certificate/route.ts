import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { image, x, y, fontSize, color } = await req.json();

  try {
    await adminDb.collection("courses").doc(id).update({
      certificateImage: image,
      certNameX: x,
      certNameY: y,
      certFontSize: fontSize,
      certFontColor: color,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar certificado" }, { status: 500 });
  }
}
