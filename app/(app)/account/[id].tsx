import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import ShawbrookModuleNetworking from "@/modules/@shawbrook/module-networking";

export default function AccountDetails() {
  const { id } = useLocalSearchParams();
  const [account, setAccount] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await ShawbrookModuleNetworking.getAccount(id as string);
        setAccount(data);
      } catch (err: any) {
        if (err.message?.includes("Session expired")) {
          setError("Session expired. Please sign in again.");
        } else {
          setError("Failed to load account details.");
        }
      }
    };
    fetchAccount();
  }, [id]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!account) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{account.name}</Text>

        <Text style={styles.label}>Number:</Text>
        <Text style={styles.value}>{account.number}</Text>

        <Text style={styles.label}>Balance:</Text>
        <Text style={styles.value}>£{account.balance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e10a93",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
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
  },
});
