export const metadata = { title: 'Black Jack' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
