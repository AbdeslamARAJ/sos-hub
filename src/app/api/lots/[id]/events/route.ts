import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  const event = await prisma.traceEvent.create({
    data: {
      lotId: id,
      eventType: data.eventType,
      location: data.location || null,
      description: data.description || null,
      temperature: data.temperature ? parseFloat(data.temperature) : null,
      performedBy: data.performedBy || null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
