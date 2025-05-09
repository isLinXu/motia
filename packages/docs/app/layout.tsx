import './global.css'
import './fonts.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { Inter, DM_Mono, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { RouteTracker } from './utils/RouteTracker'

const GTM_ID = 'GTM-P6672CSW'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s | motia',
    default: 'Motia - AI Agent Framework for Software Engineering Teams',
  },
  description:
    'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
  metadataBase: new URL('https://motia.dev'),

  // Standard OpenGraph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://motia.dev',
    siteName: 'motia',
    title: 'Motia - AI Agent Framework for Software Engineering Teams',
    description:
      'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Motia - AI Agent Framework for Software Engineering Teams',
      },
    ],
  },

  // Twitter/X
  twitter: {
    card: 'summary_large_image',
    site: '@motiadev',
    creator: '@motiadev',
    title: 'Motia - AI Agent Framework for Software Engineering Teams',
    description:
      'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
    images: ['/og-image.png'],
  },

  // Icons and PWA
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#18181b',
      },
    ],
  },

  // Additional metadata
  other: {
    // Twitter alt text
    'twitter:image:alt': 'Motia - AI Agent Framework for Software Engineering Teams',

    // Instagram
    'instagram:card': 'summary_large_image',
    'instagram:title': 'Motia - AI Agent Framework for Software Engineering Teams',
    'instagram:description':
      'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
    'instagram:image': 'https://motia.dev/og-image.png',

    // Reddit
    'reddit:title': 'Motia - AI Agent Framework for Software Engineering Teams',
    'reddit:description':
      'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
    'reddit:image': 'https://motia.dev/og-image.png',

    // LinkedIn
    'linkedin:card': 'summary_large_image',
    'linkedin:title': 'Motia - AI Agent Framework for Software Engineering Teams',
    'linkedin:description':
      'Write in any language. Automate anything. From AI agents to backend automation, motia runs event-driven workflows with zero overhead.',
    'linkedin:image': 'https://motia.dev/og-image.png',

    // Slack
    'slack-app-id': 'YOUR_SLACK_APP_ID', // If you have a Slack app

    // PWA related
    'theme-color': '#18181b',
    'application-name': 'motia',
    'apple-mobile-web-app-title': 'motia',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#18181b',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',

    // Search Engine
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION', // If you have Google Search Console
    'yandex-verification': 'YOUR_YANDEX_VERIFICATION', // If you target Yandex
    'bing-verification': 'YOUR_BING_VERIFICATION', // If you target Bing

    // Canonical URL (important for SEO)
    canonical: 'https://motia.dev',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification for webmaster tools
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script id="dataLayer-init" dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
        `}} />
        <script id="google-tag-manager" dangerouslySetInnerHTML={{ __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}} />

        {/* Add the GitHub buttons script here */}
        <Script src="https://buttons.github.io/buttons.js" strategy="afterInteractive" async defer />

        <script id="twitter-pixel" dangerouslySetInnerHTML={{ __html: `
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','p7aa5');
        `}} />
      </head>
      <body
        className="flex flex-col h-full min-h-dvh w-dvw landscape:min-h-screen landscape:h-full landscape:w-full p-0 m-0 gap-0"
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6672CSW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <RootProvider>
          {children}
          <Analytics />
          <RouteTracker />
        </RootProvider>
      </body>
    </html>
  )
}
