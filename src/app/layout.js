import { Provider } from "react-redux";
import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NestMe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display bg-[#F2F4F3] text-gray-900 antialiased">
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
