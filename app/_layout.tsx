import { SplashScreen, Stack } from 'expo-router';
import { Provider } from "react-redux";
import { useAppSelector } from '@/src/hooks';
import store, { RootState } from '@/src/store';
import { startAppInit } from '@/src/feature/app/appSlice';

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

  if (authState !== 'authenticated') {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
