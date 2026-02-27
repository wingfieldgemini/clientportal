import './globals.css'

export const metadata = {
  title: 'WingfieldGemini Client Portal',
  description: 'Client portal for WingfieldGemini projects',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-wg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}