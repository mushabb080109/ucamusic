import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";
import MiniPlayer from "@/components/player/MiniPlayer";
import FullPlayer from "@/components/player/FullPlayer";
import SplashScreen from "@/components/SplashScreen";
import ToastHost from "@/components/ui/ToastHost";
import TrackOptionsSheet from "@/components/sheets/TrackOptionsSheet";
import PlaylistPickerSheet from "@/components/sheets/PlaylistPickerSheet";
import AuthSyncProvider from "@/components/AuthSyncProvider";
import AppGate from "@/components/AppGate";
import PWARegister from "@/components/PWARegister";

export const metadata = {
  title: "ucamusic — Stream Music, Beautifully",
  description: "ucamusic adalah pemutar musik streaming premium: cari, dengarkan, dan nikmati lirik sinkron dari jutaan lagu — cepat, elegan, dan gratis.",
  applicationName: "ucamusic",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "ucamusic",
    description: "Stream music, beautifully.",
    siteName: "ucamusic",
    images: ["/banner.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ucamusic",
    description: "Stream music, beautifully.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="font-body">
        <SplashScreen />
        <AuthSyncProvider />
        <PWARegister />
        <AppGate>
          <div className="min-h-screen pb-32">{children}</div>
          <BottomNav />
          <MiniPlayer />
          <FullPlayer />
          <TrackOptionsSheet />
          <PlaylistPickerSheet />
          <ToastHost />
        </AppGate>
      </body>
    </html>
  );
}
