import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: { lot: true, createdBy: { select: { name: true, email: true } } },
  });
  return NextResponse.json(alerts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const alert = await prisma.alert.create({
    data: {
      title: data.title,
      description: data.description || null,
      severity: data.severity || "MEDIUM",
      type: data.type || "QUALITY",
      lotId: data.lotId || null,
      createdById: data.createdById || null,
    },
  });
  return NextResponse.json(alert, { status: 201 });
}
