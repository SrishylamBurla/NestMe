import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";
import { Spline_Sans } from "next/font/google";
import Script from "next/script";
import { useGetMeQuery } from "@/store/services/authApi";

const spline = Spline_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "NestMe",
  description: "Find your perfect home",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",              // ✅ proper favicon
    // shortcut: "/favicon-16x16.png",    // ✅ small version
    apple: "/icons/icon-192.png",      // ✅ for iOS
  },
};

export const viewport = {
  themeColor: "#f2f4f3",
};

export default function RootLayout({ children }) {

  const { data: user } = useGetMeQuery();
  return (
    <html lang="en">
      <head>
        {/* ❌ REMOVE GOOGLE FONT LINK (already using next/font) */}

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
          rel="stylesheet"
        />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>

      <body
        className={`${spline.className} bg-[#F2F4F3] text-gray-900 antialiased`}
      >
        <Providers>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "16px",
                padding: "14px 18px",
                fontWeight: "600",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}