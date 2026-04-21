import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const doc = await adminDb.collection("users").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const enrollmentsSnap = await adminDb.collection("enrollments").where("userId", "==", id).get();
    const enrollments = await Promise.all(
      enrollmentsSnap.docs.map(async (eDoc) => {
        const eData = eDoc.data();
        const courseDoc = await adminDb.collection("courses").doc(eData.courseId).get();
        return {
          id: eDoc.id,
          ...eData,
          courseTitle: courseDoc.exists ? courseDoc.data()?.title : "Curso removido",
        };
      })
    );

    return NextResponse.json({ id: doc.id, ...doc.data(), enrollments });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching student" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete all enrollments for this student
    const enrollmentsSnap = await adminDb.collection("enrollments").where("userId", "==", id).get();
    const batch = adminDb.batch();
    enrollmentsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    
    // Delete the student
    batch.delete(adminDb.collection("users").doc(id));
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting student" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id: _, enrollments: __, ...updateData } = data;
    await adminDb.collection("users").doc(id).update(updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error updating student" }, { status: 500 });
  }
}
