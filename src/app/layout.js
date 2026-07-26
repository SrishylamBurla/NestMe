// import "./globals.css";
// import { Providers } from "./Providers";
// import { Toaster } from "react-hot-toast";
// import { Spline_Sans } from "next/font/google";
// import AuthProvider from "@/components/AuthProvider";
// import Script from "next/script";
// import { SocketProvider } from "../context/SocketProvider";

// const spline = Spline_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
// });

// export const metadata = {
//   title: "NestMe",
//   description: "Find your perfect home",
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/favicon.ico", // ✅ proper favicon
//     shortcut: "/favicon.png", // ✅ small version
//     apple: "/icons/icon-192.png", // ✅ for iOS
//   },
// };

// export const viewport = {
//   themeColor: "#f2f4f3",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* ❌ REMOVE GOOGLE FONT LINK (already using next/font) */}

//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
//           rel="stylesheet"
//         />

//         <Script
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="afterInteractive"
//         />
//       </head>

//       <body
//         className={`${spline.className} bg-[#F2F4F3] text-gray-900 antialiased`}
//       >
//         <Providers>
//           <SocketProvider>
//             <AuthProvider>{children}</AuthProvider>
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 style: {
//                   borderRadius: "16px",
//                   padding: "14px 18px",
//                   fontWeight: "500",
//                 },
//               }}
//             />{" "}
//           </SocketProvider>
//         </Providers>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";
import { Spline_Sans } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { SocketProvider } from "@/context/SocketProvider";
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
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#f2f4f3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
          <SocketProvider>
            <AuthProvider>
              {children}
            </AuthProvider>

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "16px",
                  padding: "14px 18px",
                  fontWeight: "500",
                },
                success: {
                  iconTheme: {
                    primary: "#16a34a",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#dc2626",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}