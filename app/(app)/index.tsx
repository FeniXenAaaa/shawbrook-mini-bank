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

export default function Index() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await ShawbrookModuleNetworking.getAccounts();
        // TODO: Validate with Zod or a type guard before using
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
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(app)/account/[id]",
                params: { id: item.number },
              })
            }
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.number}>Account No: {item.number}</Text>
                <Text style={styles.balance}>Balance: £{item.balance}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e10a93",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e10a93",
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
    color: "#555",
    marginBottom: 6,
  },
  balance: {
    fontWeight: "bold",
    color: "#333",
  },
  arrow: {
    fontSize: 24,
    color: "#e10a93",
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  loadingText: {
    color: "#888",
    fontSize: 16,
  },
});
