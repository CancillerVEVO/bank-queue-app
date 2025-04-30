import type { Metadata } from "next";
import "@/app/globals.css";
import { SocketProvider } from "@/app/contexts/SocketContext";


export const metadata: Metadata = {
  title: {
    template: "%s | SmartQueue",
    default: "SmartQueue",
  },
  description: "SmartQueue is a smart queue management system that helps you manage your queues efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
