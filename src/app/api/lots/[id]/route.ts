import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      product: true,
      supplier: true,
      traceEvents: { orderBy: { createdAt: "asc" } },
      alerts: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lot);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  const updateData: Record<string, unknown> = {};
  if (data.status) updateData.status = data.status;
  if (data.quantity) updateData.quantity = parseFloat(data.quantity);
  if (data.temperature !== undefined) updateData.temperature = data.temperature ? parseFloat(data.temperature) : null;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const lot = await prisma.lot.update({ where: { id }, data: updateData });

  if (data.status) {
    await prisma.traceEvent.create({
      data: {
        lotId: id,
        eventType: data.status === "DISPATCHED" ? "SHIPPED" : data.status === "RECALLED" ? "RECALLED" : "PROCESSED",
        description: `Status changed to ${data.status}`,
        performedBy: data.performedBy,
      },
    });
  }

  return NextResponse.json(lot);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.lot.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
