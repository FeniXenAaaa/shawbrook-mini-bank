import { SplashScreen, Stack } from 'expo-router';
import { Provider } from "react-redux";
import { useAppSelector } from '@/src/hooks';
import store, { RootState } from '@/src/store';
import { startAppInit } from '@/src/feature/app/appSlice';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Button, View } from 'react-native';
import AuthenticationModule from '@/modules/@shawbrook/module-authentication/src/AuthenticationModule';

SplashScreen.preventAutoHideAsync();
store.dispatch(startAppInit());

export default function Root() {
  return (
    <Provider store={store}>
      <RootNavigator/>
    </Provider>
  );
}

function RootNavigator() {
  const { authState } = useAppSelector((state: RootState) => state.auth);
  const handleSignOut = async () => {
    await AuthenticationModule.signOut();
  };

  if (authState !== 'authenticated') {
    return null;
  }

  return (
    <Drawer screenOptions={{ headerShown: false }}
            drawerContent={(props) => (
              <DrawerContentScrollView {...props}>

                <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                  <Button title="Sign Out" onPress={handleSignOut}/>
                </View>
              </DrawerContentScrollView>
            )}>
      <Drawer.Screen options={{
        title: "Accounts"
      }} name="(app)"/>
    </Drawer>
  );
  /*  return (
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="(app)" />
      </Stack>
    );*/
}

/*

<Drawer
  drawerContent={(props) => (
    <DrawerContentScrollView {...props}>
      {/!* Default drawer items (gestures and navigation preserved) *!/}
      <DrawerItemList {...props} />

      {/!* Custom Sign Out button *!/}
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </DrawerContentScrollView>
  )}
>*/
