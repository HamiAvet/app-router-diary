export default function manifest() {
  return {
    name: 'Dyiary PWA',
    short_name: 'Dyiary',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/diary-icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/diary-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}