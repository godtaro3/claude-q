import './globals.css'

export const metadata = {
  title: 'Claude Q - AI Task Queue Manager',
  description: 'Production-grade task queue manager for Claude API. Queue dozens of tasks to run overnight with automatic error recovery.',
  authors: [{ name: 'Godtaro' }],
  keywords: ['Claude', 'AI', 'Task Queue', 'Anthropic', 'API', 'Automation'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
