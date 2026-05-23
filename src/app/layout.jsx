import "./globals.css";

export const metadata = {
  title: "Cinema Seats",
  description: "Cinematic cinema seat picker with Next.js, Tailwind, and Framer Motion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
