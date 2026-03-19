import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";

export async function GET() {
  const lots = await prisma.lot.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, supplier: true, _count: { select: { traceEvents: true, alerts: true } } },
  });
  return NextResponse.json(lots);
}

export async function POST(request: Request) {
  const data = await request.json();

  const lot = await prisma.lot.create({
    data: {
      lotNumber: data.lotNumber,
      productId: data.productId,
      supplierId: data.supplierId || null,
      quantity: parseFloat(data.quantity),
      unit: data.unit || "kg",
      origin: data.origin || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      temperature: data.temperature ? parseFloat(data.temperature) : null,
      notes: data.notes || null,
    },
  });

  const qrCode = await generateQRCode(lot.id, lot.lotNumber);
  const updated = await prisma.lot.update({
    where: { id: lot.id },
    data: { qrCode },
  });

  await prisma.traceEvent.create({
    data: {
      lotId: lot.id,
      eventType: "RECEIVED",
      description: `Lot ${lot.lotNumber} received`,
      location: data.origin || undefined,
    },
  });

  return NextResponse.json(updated, { status: 201 });
}
