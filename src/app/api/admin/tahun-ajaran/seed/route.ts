import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("al_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const allowedRoles = ["admin", "admin_super", "head_of_it"];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 0. Kembalikan nama TA lama yang mungkin sempat di-rename user menjadi 2027/2028
      await tx.tahunAjaran.updateMany({
        where: { tahun_mulai: 2026, tahun_selesai: 2027 },
        data: { nama: "2026/2027" }
      });

      // 1. Cari atau buat 2027/2028 (dengan tahun_mulai: 2027 yang BENAR)
      let ta2027 = await tx.tahunAjaran.findFirst({
        where: { tahun_mulai: 2027, tahun_selesai: 2028 } });

      if (!ta2027) {
        ta2027 = await tx.tahunAjaran.create({
          data: {
            tahun_mulai: 2027,
            tahun_selesai: 2028,
            nama: "2027/2028",
            is_active: true,
            tanggal_buka_pendaftaran: new Date("2026-08-01"),
            tanggal_tutup_pendaftaran: new Date("2027-01-31"),
            biaya_pendaftaran: 250000 } });
      } else {
        await tx.tahunAjaran.update({
          where: { id: ta2027.id },
          data: { is_active: true, biaya_pendaftaran: 250000, nama: "2027/2028" } });
      }

      // 2. Nonaktifkan yang lain
      await tx.tahunAjaran.updateMany({
        where: { id: { not: ta2027.id }, is_active: true },
        data: { is_active: false } });

      return ta2027;
    });

    return NextResponse.json({
      success: true,
      message: "Tahun Ajaran 2027/2028 berhasil dibuat/diaktifkan dan Data pendaftar berhasil dimigrasi (koreksi awalan nomor).",
      data: result });
  } catch (error) {
    console.error("Seed tahun ajaran error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET method to check current status
export async function GET() {
  try {
    // 1. Validasi session manual
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("al_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Check custom role
    const allowedRoles = ["admin", "admin_super", "head_of_it"];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await prisma.tahunAjaran.findMany({
      orderBy: { tahun_mulai: "desc" } });

    const active = data.find((ta) => ta.is_active);
    const has2027 = data.find(
      (ta) => ta.tahun_mulai === 2027,
    );

    return NextResponse.json({
      all: data,
      active,
      has2027_2028: !!has2027 });
  } catch (error) {
    console.error("Get tahun ajaran error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}







