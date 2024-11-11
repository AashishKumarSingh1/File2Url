import localFont from "next/font/local";
import "./globals.css";
import Footer from "./components/footer";
import Header from "./components/header";
import { UserProvider } from "./(root)/context/user.context";
import { Toaster } from "react-hot-toast";
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
  title: "File2Url",
  description: "From Files to Links, Simplifying Transfers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
        <Toaster />
        <Header />
        {children}
        <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
