import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useTheme } from "@react-navigation/native";

const StacksLayout = () => {
  const nav = useNavigation();
  const { colors } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Accounts",
          headerTitleAlign: "center",
          headerLeft: () => {
            return (
              <Ionicons
                name="menu"
                size={24}
                color={colors.text}
                onPress={() => {
                  nav.dispatch(DrawerActions.openDrawer());
                }}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="ai-chat"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "AI Chat",
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
