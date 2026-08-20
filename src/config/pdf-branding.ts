export const PDF_BRANDING = {
  template: "full_image" as "full_image" | "programmatic",
  institution: {
    name: "PESANTREN ISLAM INTERNASIONAL AL-ANDALUS PUTRA",
    subtitle: "Kaderisasi Umat Rabbani, Cendekia, dan Mandiri",
    committee: "PANITIA PENERIMAAN SANTRI BARU",
    academic_year: "2027/2028",
    address: "Jl. Raya Menteng, KM.13 RT.03/04, Dusun Cijurey, Desa Sukadamai, Kec. Sukamakmur, Kab. Bogor 16830",
    contact: "Website: https://pesantren-alandalus-putra.com | Email: info@pesantren-alandalus.com",
    phones: "WhatsApp: 0838-1151-5951",
  },
  assets: {
    logo: "/images/logo-putra.png",
    kop_full: "/images/kop-surat-full.jpg",
    stamp: "/images/stempel-pesantren.jpg",
    signature: "/images/ttd-mudir.png",
  },
  content_area: {
    y_start: 70,
    y_end: 255,
    x_left: 18,
    x_right: 192,
    width: 174,
  },
  coords: {
    header: {
      logo: { x: 18, y: 11, w: 20, h: 28 },
      vertical_bar: { x1: 44, y1: 13, x2: 44, y2: 39, width: 0.2 },
      text_x: 48,
      horizontal_sep: {
        y_thick: 45,
        y_thin: 46.5,
        thickness_thick: 1.2,
        thickness_thin: 0.3,
      },
    },
    signature: {
      stamp: { w: 35, h: 35 },
      ttd: { w: 35, h: 35 },
      margin_right: 95,
      y_offset_ttd: 5,
    },
  },
  authority: {
    name: "Ustadz Nurdin, Lc",
    role: "Mudir Pesantren",
    city: "Bogor",
  },
};

