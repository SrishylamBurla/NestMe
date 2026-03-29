import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";
import { Spline_Sans } from "next/font/google";
import Script from "next/script";

const spline = Spline_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "NestMe",
  description: "Find your perfect home",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/splash.png",
    apple: "/icons/splash.png",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
