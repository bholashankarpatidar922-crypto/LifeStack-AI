import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'ai.lifestack.app',
  appName: 'LifeStack',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B0F19',
      showSpinner: false
    }
  }
};

export default config;
