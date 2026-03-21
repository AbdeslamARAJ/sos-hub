import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const lot = await prisma.lot.findFirst({
    where: {
      OR: [
        { lotNumber: { equals: q } },
        { lotNumber: { contains: q } },
      ],
    },
    select: { id: true, lotNumber: true },
  });

  if (!lot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(lot);
}
