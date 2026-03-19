import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  const updateData: Record<string, unknown> = {};
  if (data.status) {
    updateData.status = data.status;
    if (data.status === "RESOLVED") updateData.resolvedAt = new Date();
  }
  if (data.severity) updateData.severity = data.severity;

  const alert = await prisma.alert.update({ where: { id }, data: updateData });
  return NextResponse.json(alert);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.alert.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
