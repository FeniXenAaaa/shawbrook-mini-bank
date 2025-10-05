import { Drawer } from 'expo-router/drawer';
import { View, Button } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AuthenticationModule from '@/modules/@shawbrook/module-authentication/src/AuthenticationModule';

export default function AppLayout() {
  const handleSignOut = async () => {
    await AuthenticationModule.signOut();
  };

  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          {/* Default drawer items (gestures and navigation preserved) */}
          <DrawerItemList {...props} />

          {/* Custom Sign Out button */}
          <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
            <Button title="Sign Out" onPress={handleSignOut} />
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          title: 'Overview',
        }}
      />
    </Drawer>
  );
}
