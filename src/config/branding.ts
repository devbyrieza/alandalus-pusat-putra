export type AppMode = "PUTRA" | "PUTRI";
export const APP_MODE: AppMode = "PUTRA";
export const IS_PUTRA = true;
export const IS_PUTRI = false;

export const BRANDING = {
  schoolName: "Pesantren Islam Internasional Al-Andalus Putra",
  schoolShortName: "Al-Andalus",
  schoolLegalName: "Pesantren Islam Internasional Al-Andalus",
  schoolTagline: "Kaderisasi Umat Rabbani, Cendekia, dan Mandiri",
  schoolNetwork: "Perpaduan Kurikulum Nasional dan Khas Andalus",
  primaryColor: "#064e3b",
  secondaryColor: "#fbbf24",
  logoPath: "/images/logo-putra.png",
  faviconPath: "/favicon.ico",
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://pesantren-alandalus-putra.com",
  mainPortalUrl: "https://pesantren-alandalus.com",
  dashboardTitle: "Panel Admin SPMB",
  
  contact: {
    whatsapp: "+62 838-1151-5951",
    whatsapp2: "+62 811-3920-135",
    finance: "+62 858-9411-1050",
    facebook: "https://www.facebook.com/pp.alandalus",
    instagram: "https://www.instagram.com/pp_alandalus/",
    youtube: "https://www.youtube.com/andalustv",
    tiktok: "https://www.tiktok.com/@pp.alandalus",
    address: "Jl. Raya Menteng, KM. 13 RT.03/04, Dusun Cijurey, Desa Sukadamai, Kec. Sukamakmur, Kab. Bogor."
  },
  
  // Properties required by SPMB dashboard & layout backward compatibility
  address: "Jl. Raya Menteng, KM. 13 RT.03/04, Dusun Cijurey, Desa Sukadamai, Kec. Sukamakmur, Kab. Bogor.",
  phone: "+62 838-1151-5951",
  email: "info@pesantren-alandalus.com",
  igUrl: "https://www.instagram.com/pp_alandalus/",
  ytUrl: "https://www.youtube.com/andalustv",
  fbUrl: "https://www.facebook.com/pp.alandalus",
  twitterUrl: "#" };
