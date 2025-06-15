
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e6ebca84aa7b47deb194f209751e7f74',
  appName: 'medmate-medicine-manager-pro',
  webDir: 'dist',
  server: {
    url: 'https://e6ebca84-aa7b-47de-b194-f209751e7f74.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
