import React from "react";

// app/layout.tsx — applies to everything, keep it minimal
export default function RootLayout({ children } : {children : React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}