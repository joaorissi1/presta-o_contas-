import { Montserrat, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
});

export const metadata = {
  title: "Prestação de Contas · Valon Consult",
  description: "Reembolsos, notas de débito e fluxo de aprovação — Valon Consult.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${outfit.variable} ${jbMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
