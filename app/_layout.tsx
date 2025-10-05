import { SplashScreen } from "expo-router";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/src/hooks";
import store, { RootState } from "@/src/store";
import { startAppInit } from "@/src/feature/app/appSlice";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Button, View, Switch, Text, Pressable } from "react-native";
import AuthenticationModule from "@/modules/@shawbrook/module-authentication/src/AuthenticationModule";
import { ThemeProvider } from "@react-navigation/native";
import { persistTheme, setMode } from "@/src/feature/theme/themeSlice";
import { lightTheme, darkTheme } from "@/src/feature/theme/theme";

SplashScreen.preventAutoHideAsync();
store.dispatch(startAppInit());

export default function Root() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

function RootNavigator() {
  const { authState } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const handleSignOut = async () => {
    await AuthenticationModule.signOut();
  };
  const themeMode = useAppSelector((state: RootState) => state.theme.current);
  const theme = themeMode === "dark" ? lightTheme : darkTheme;

  if (authState !== "authenticated") {
    return null;
  }

  return (
    <ThemeProvider
      value={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: "#e10a93",
        },
      }}
    >
      {/*TODO: Move drawer to own component */}
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 16 }}
            >
              <Switch
                value={themeMode === "dark"}
                onValueChange={() => {
                  const newValue = themeMode === "dark" ? "light" : "dark";
                  dispatch(setMode(newValue));
                  dispatch(persistTheme(newValue));
                }}
              />
              <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>

            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
              <Pressable
                onPress={handleSignOut}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          options={{
            title: "Accounts",
          }}
          name="(app)"
        />
      </Drawer>
    </ThemeProvider>
  );
}
