import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  uri: string | null | undefined;
  style?: any;
};

export default function BookCover({ uri, style }: Props) {
  const [loading, setLoading] = useState(true);

  const source = uri
    ? { uri: uri.startsWith("http") ? uri : `${process.env.EXPO_PUBLIC_API_URL}/${uri.replace(/^\//, "")}` }
    : null;

  return (
    <View style={[styles.wrapper, style]}>
      {source && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="disk"
          onLoadEnd={() => setLoading(false)}
        />
      )}
      {(loading || !source) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#E85D54" />
          <Text style={styles.loadingText}>Image loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: "hidden", backgroundColor: "#FFF5F4" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F4",
    gap: 6,
  },
  loadingText: { fontSize: 11, color: "#E85D54", fontWeight: "500" },
});
