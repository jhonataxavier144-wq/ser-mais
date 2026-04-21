import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { courseId, lessonId, completed } = await req.json();
  const userId = (session.user as any).id;

  try {
    const enrollmentsRef = adminDb.collection("enrollments");
    const snapshot = await enrollmentsRef
      .where("userId", "==", userId)
      .where("courseId", "==", courseId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Matrícula não encontrada" }, { status: 404 });
    }

    const enrollmentDoc = snapshot.docs[0];
    const enrollmentData = enrollmentDoc.data();
    let completedLessons = enrollmentData.completedLessons || [];

    if (completed) {
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
    } else {
      completedLessons = completedLessons.filter((id: string) => id !== lessonId);
    }

    // Calculate progress
    const courseDoc = await adminDb.collection("courses").doc(courseId).get();
    const courseData = courseDoc.data();
    const totalLessons = courseData?.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0) || 1;
    const progress = Math.round((completedLessons.length / totalLessons) * 100);

    await enrollmentDoc.ref.update({
      completedLessons,
      progress,
    });

    if (completed) {
      await adminDb.collection("users").doc(userId).update({
        xp: admin.firestore.FieldValue.increment(50),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar progresso" }, { status: 500 });
  }
}
