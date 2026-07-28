import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const p = await prisma.pendaftar.findMany({
      where: {
        OR: [
          { nama_lengkap: { contains: "Abdurrahim Pati Raja", mode: "insensitive" } },
          { nama_lengkap: { contains: "Ken Alfarezha", mode: "insensitive" } }
        ]
      },
      select: {
        nama_lengkap: true,
        jenjang: true,
        status_pendaftaran: true,
        deleted_at: true,
        tahun_ajaran: {
          select: {
            nama: true
          }
        },
        data_lengkap: true
      }
    });

    return NextResponse.json({ success: true, data: p });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
