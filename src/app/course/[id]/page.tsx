import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import CoursePlayer from "@/components/CoursePlayer";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!courseId || typeof courseId !== "string") {
    redirect("/dashboard");
  }

  const userId = (session.user as any).id;
  const courseDoc = await adminDb.collection("courses").doc(courseId).get();

  if (!courseDoc.exists) {
    redirect("/dashboard");
  }

  const courseData = courseDoc.data()!;
  const course = { 
    id: courseDoc.id, 
    ...courseData,
    modules: courseData.modules || []
  };

  // Check enrollment
  const enrollmentRef = adminDb.collection("enrollments");
  const enrollmentQuery = await enrollmentRef
    .where("userId", "==", userId)
    .where("courseId", "==", courseId)
    .get();

  let enrollment;

  if (enrollmentQuery.empty) {
    // Auto-enroll
    const newEnrollment = {
      userId,
      courseId: courseId,
      progress: 0,
      completedLessons: [],
      createdAt: new Date().toISOString()
    };
    const docRef = await enrollmentRef.add(newEnrollment);
    enrollment = { id: docRef.id, ...newEnrollment };
  } else {
    enrollment = { id: enrollmentQuery.docs[0].id, ...enrollmentQuery.docs[0].data() };
  }

  return <CoursePlayer course={course} enrollment={enrollment} />;
}
