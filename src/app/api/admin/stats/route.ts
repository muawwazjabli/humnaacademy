import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth-server";
import { listCollection } from "@/lib/firebase-rest";

export const dynamic = "force-dynamic";

function getMonthLabel(isoDate?: string): string {
  if (!isoDate) return "Unknown";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = auth.authToken;

    const [
      studentsRes,
      teachersRes,
      coursesRes,
      trialsRes,
      blogsRes,
      testimonialsRes,
      messagesRes,
      notificationsRes,
      activityRes,
    ] = await Promise.all([
      listCollection("students", token, 300),
      listCollection("teachers", token, 200),
      listCollection("courses", token, 200),
      listCollection("trial_requests", token, 400),
      listCollection("blogs", token, 200),
      listCollection("testimonials", token, 200),
      listCollection("contactMessages", token, 300),
      listCollection("notifications", token, 100),
      listCollection("activityLogs", token, 50),
    ]);

    const students = studentsRes.docs.map((d) => d.data);
    const teachers = teachersRes.docs.map((d) => d.data);
    const courses = coursesRes.docs.map((d) => d.data);
    const trials = trialsRes.docs.map((d) => d.data);
    const blogs = blogsRes.docs.map((d) => d.data);
    const testimonials = testimonialsRes.docs.map((d) => d.data);
    const messages = messagesRes.docs.map((d) => d.data);
    const notifications = notificationsRes.docs.map((d) => d.data);
    const activities = activityRes.docs.map((d) => d.data);

    // Sort trials newest first
    trials.sort(
      (a: any, b: any) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    // Sort activities newest first
    activities.sort(
      (a: any, b: any) =>
        new Date(b.timestamp || b.createdAt || 0).getTime() -
        new Date(a.timestamp || a.createdAt || 0).getTime()
    );

    const pendingTrials = trials.filter(
      (t: any) => !t.status || t.status === "New" || t.status === "Pending" || t.status === "Contacted"
    );

    const publishedTestimonials = testimonials.filter(
      (item: any) => item.status === "published" && item.approvalStatus === "approved"
    );

    const unreadNotifications = notifications.filter((n: any) => !n.read).length;

    // Monthly Trials & Enrollment Trends
    const monthlyTrialsMap: Record<string, number> = {};
    const monthlyEnrollmentsMap: Record<string, number> = {};
    const coursePopMap: Record<string, number> = {};
    const trialStatusMap: Record<string, number> = {};

    for (const tr of trials as any[]) {
      const m = getMonthLabel(tr.createdAt);
      if (m !== "Unknown") {
        monthlyTrialsMap[m] = (monthlyTrialsMap[m] || 0) + 1;
      }
      const courseName = tr.preferredCourse || "Unspecified";
      coursePopMap[courseName] = (coursePopMap[courseName] || 0) + 1;

      const statusName = tr.status || "New";
      trialStatusMap[statusName] = (trialStatusMap[statusName] || 0) + 1;
    }

    const monthlyStudentsMap: Record<string, number> = {};
    for (const st of students as any[]) {
      const m = getMonthLabel(st.enrollmentDate || st.createdAt);
      if (m !== "Unknown") {
        monthlyStudentsMap[m] = (monthlyStudentsMap[m] || 0) + 1;
        if (st.status === "Active" || st.status === "Completed") {
          monthlyEnrollmentsMap[m] = (monthlyEnrollmentsMap[m] || 0) + 1;
        }
      }
      if (st.selectedCourse) {
        coursePopMap[st.selectedCourse] = (coursePopMap[st.selectedCourse] || 0) + 1;
      }
    }

    const monthlyTrials = Object.entries(monthlyTrialsMap)
      .slice(-6)
      .map(([label, value]) => ({ label, value }));

    const studentTrends = Object.entries(monthlyStudentsMap)
      .slice(-6)
      .map(([label, value]) => ({ label, value }));

    const monthlyEnrollments = Object.entries(monthlyEnrollmentsMap)
      .slice(-6)
      .map(([label, value]) => ({ label, value }));

    const coursePopularity = Object.entries(coursePopMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    const trialStatuses = Object.entries(trialStatusMap).map(([label, value]) => ({
      label,
      value,
    }));

    return NextResponse.json({
      stats: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalTrialRequests: trials.length,
        pendingTrialRequests: pendingTrials.length,
        totalBlogPosts: blogs.length,
        publishedTestimonials: publishedTestimonials.length,
        totalContactMessages: messages.length,
        unreadMessages: messages.filter((m: any) => m.status === "New").length,
        unreadNotifications,
      },
      charts: {
        monthlyTrials,
        studentTrends,
        monthlyEnrollments,
        coursePopularity,
        trialStatuses,
      },
      recentTrials: trials.slice(0, 8),
      recentActivities: activities.slice(0, 10),
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load dashboard stats" }, { status: 500 });
  }
}
