import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jadwals = await prisma.jadwalUjian.findMany({
      include: {
        pendaftar: { select: { id: true, nama_lengkap: true, nomor_pendaftaran: true } },
        exam_session: {
          include: {
            creator: { select: { id: true, full_name: true, role: true } }
          }
        },
        penguji_quran: { select: { id: true, full_name: true } },
        penguji_santri: { select: { id: true, full_name: true } },
        penguji_ortu: { select: { id: true, full_name: true } },
        penguji_hafalan: { select: { id: true, full_name: true } },
        penguji_arab: { select: { id: true, full_name: true } },
        nilai_ujian: true,
      },
      orderBy: { created_at: "desc" }
    });

    let updatedCount = 0;
    const updates = [];

    for (const jadwal of jadwals) {
      const session = jadwal.exam_session;
      let updateData: any = {};
      const title = (session?.title || "").toLowerCase();
      const creator = session?.creator;
      const creatorId = session?.created_by;

      if (creatorId) {
        if ((title.includes("qur") || title.includes("bacaan") || creator?.role?.includes("quran")) && !jadwal.penguji_quran_id) {
          updateData.penguji_quran_id = creatorId;
        }
        if ((title.includes("santri") || title.includes("calsan") || creator?.role?.includes("santri") || creator?.role === "pewawancara_calsan") && !jadwal.penguji_santri_id) {
          updateData.penguji_santri_id = creatorId;
        }
        if ((title.includes("ortu") || title.includes("cawalsan") || title.includes("wali") || creator?.role?.includes("ortu") || creator?.role === "pewawancara_cawalsan") && !jadwal.penguji_ortu_id) {
          updateData.penguji_ortu_id = creatorId;
        }
        if (title.includes("hafalan") && !jadwal.penguji_hafalan_id) {
          updateData.penguji_hafalan_id = creatorId;
        }
        if ((title.includes("arab") || title.includes("lisan")) && !jadwal.penguji_arab_id) {
          updateData.penguji_arab_id = creatorId;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.jadwalUjian.update({
          where: { id: jadwal.id },
          data: updateData
        });
        updatedCount++;
        updates.push({ id: jadwal.id, nama: jadwal.pendaftar?.nama_lengkap, ...updateData });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} records`,
      updates,
      records: jadwals.map(j => ({
        id: j.id,
        nama: j.pendaftar?.nama_lengkap,
        nomor: j.pendaftar?.nomor_pendaftaran,
        tanggal_ujian: j.tanggal_ujian,
        session_title: j.exam_session?.title,
        session_created_by: j.exam_session?.created_by,
        session_creator_name: j.exam_session?.creator?.full_name,
        session_creator_role: j.exam_session?.creator?.role,
        penguji_quran: j.penguji_quran?.full_name,
        penguji_santri: j.penguji_santri?.full_name,
        penguji_ortu: j.penguji_ortu?.full_name,
        penguji_hafalan: j.penguji_hafalan?.full_name,
        penguji_arab: j.penguji_arab?.full_name,
        catatan: j.catatan,
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
