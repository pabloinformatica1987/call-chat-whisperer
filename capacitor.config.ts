
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0a5adbc0e02940a4b3dc39f10b850b24',
  appName: 'call-chat-whisperer',
  webDir: 'dist',
  server: {
    url: 'https://0a5adbc0-e029-40a4-b3dc-39f10b850b24.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Qui si possono aggiungere configurazioni specifiche per i plugin
  }
};

export default config;
