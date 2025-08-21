import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3de5bcfd576946058e53af7bf31d1eb0',
  appName: 'carpool-buddy-clone',
  webDir: 'dist',
  server: {
    url: 'https://3de5bcfd-5769-4605-8e53-af7bf31d1eb0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2563eb',
      showSpinner: false
    }
  }
};

export default config;