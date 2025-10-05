import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import ShawbrookModuleNetworking from "@/modules/@shawbrook/module-networking";
import ChatFloatingButton from '@/src/shared/components/chat-floating-button';
import { useTheme } from '@react-navigation/native';

export default function Index() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await ShawbrookModuleNetworking.getAccounts();
        setAccounts(data);
      } catch (err: any) {
        if (err.message?.includes("Session expired")) {
          setError("Session expired. Please sign in again.");
        } else {
          setError("Failed to load accounts.");
        }
      }
    };
    fetchAccounts();
  }, []);

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}
            onPress={() =>
              router.push({
                pathname: "/(app)/account/[id]",
                params: { id: item.number },
              })
            }
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.number, { color: colors.text }]}>Account No: {item.number}</Text>
                <Text style={[styles.balance, { color: colors.text }]}>Balance: £{item.balance}</Text>
              </View>
              <Text style={[styles.arrow, { color: colors.primary }]}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <ChatFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  number: {
    marginBottom: 6,
  },
  balance: {
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 24,
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
  },
});
