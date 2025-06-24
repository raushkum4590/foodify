import localFont from "next/font/local";
import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs"; // Temporarily disabled
import { CartProvider } from './_context/CartContext';
import { NotificationProvider } from './_context/NotificationContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Foodify - Food Delivery App",
  description: "Order delicious food from your favorite restaurants",
};

export default function RootLayout({ children }) {
  return (
    // <ClerkProvider> // Temporarily disabled
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NotificationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationProvider>
        </body>
      </html>
    // </ClerkProvider> // Temporarily disabled
  );
}
