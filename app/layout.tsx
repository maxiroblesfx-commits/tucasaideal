import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tucasaideal.vercel.app"),
  title: "TuCasaIdeal | Inmobiliaria Premium de Lujo • Buenos Aires & Argentina",
  description: "Experiencia inmobiliaria de elite. Propiedades exclusivas, tecnología de vanguardia y servicio personalizado.",
  keywords: ["inmobiliaria de lujo", "propiedades premium", "Buenos Aires", "Puerto Madero", "Recoleta", "Palermo", "casas de lujo", "departamentos exclusivos"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://tucasaideal.vercel.app",
    siteName: "TuCasaIdeal",
    title: "TuCasaIdeal | Inmobiliaria Premium de Lujo",
    description: "Propiedades exclusivas, tecnología de vanguardia y servicio personalizado para compradores y propietarios de elite.",
    images: [{ url: "/properties/hero.jpg", width: 2000, height: 1200, alt: "Propiedad de lujo — TuCasaIdeal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuCasaIdeal | Inmobiliaria Premium de Lujo",
    description: "Propiedades exclusivas, tecnología de vanguardia y servicio personalizado.",
    images: ["/properties/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8F5F0] text-[#2C3E50]">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
