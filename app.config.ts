import "tsx/cjs";
import { ExpoConfig } from "expo/config";

module.exports = ({ config }: { config: ExpoConfig }) => ({
  name: "shawbrook-mini-bank",
  slug: "shawbrook-mini-bank",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "shawbrookminibank",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.anonymous.shawbrookminibank",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "./modules/@shawbrook/module-authentication/plugins/config.plugin.ts",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
