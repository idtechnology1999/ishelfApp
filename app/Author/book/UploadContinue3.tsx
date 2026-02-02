import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function Upload4() {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [extraFiles, setExtraFiles] = useState<any>(null);

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setCoverImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickPDFFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/csv", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPdfFile(result);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const pickExtraFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/csv", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        setExtraFiles(result);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick files");
    }
  };

  const handleContinue = () => {
    if (coverImage && pdfFile) {
      router.push("/Author/book/UploadContinue4");
    } else {
      Alert.alert("Required Files", "Please upload cover image and PDF file");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#E85D54" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>File Upload</Text>
            <Text style={styles.progressCounter}>3/6</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Upload Cover Image */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload Cover Image</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickCoverImage}
          >
            <Ionicons name="image-outline" size={40} color="#E85D54" />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadMainText}>
                <Text style={styles.uploadLink}>Choose a file</Text>
                <Text style={styles.uploadOr}> Or </Text>
                <Text style={styles.uploadDrag}>Drag and Drop</Text>
              </Text>
              <Text style={styles.uploadSubText}>
                JPEG and PNG Formats up to 10MB
              </Text>
            </View>
            {coverImage && (
              <View style={styles.fileSelectedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.fileSelectedText}>Image selected</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Upload PDF File */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload PDF file (main content)</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickPDFFile}
          >
            <Ionicons name="document-outline" size={40} color="#E85D54" />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadMainText}>
                <Text style={styles.uploadLink}>Choose a file</Text>
                <Text style={styles.uploadOr}> Or </Text>
                <Text style={styles.uploadDrag}>Drag and Drop</Text>
              </Text>
              <Text style={styles.uploadSubText}>
                CSV and DOC Formats up to 50MB
              </Text>
            </View>
            {pdfFile && (
              <View style={styles.fileSelectedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.fileSelectedText}>PDF selected</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Optional Extra Files */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>
            Optional extra files (materials, slides, worksheets)
          </Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickExtraFiles}
          >
            <Ionicons name="document-outline" size={40} color="#E85D54" />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadMainText}>
                <Text style={styles.uploadLink}>Choose a file</Text>
                <Text style={styles.uploadOr}> Or </Text>
                <Text style={styles.uploadDrag}>Drag and Drop</Text>
              </Text>
              <Text style={styles.uploadSubText}>
                CSV and DOC Formats up to 50MB
              </Text>
            </View>
            {extraFiles && (
              <View style={styles.fileSelectedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.fileSelectedText}>Files selected</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 36,
  },

  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E85D54", // I-SHELF coral red
  },

  progressCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  progressBarContainer: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },

  progressBarFilled: {
    flex: 3,
    backgroundColor: "#E85D54", // I-SHELF coral red
  },

  progressBarEmpty: {
    flex: 3,
    backgroundColor: "#FFE8E6", // Light coral
  },

  uploadSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  uploadLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },

  uploadBox: {
    borderWidth: 2,
    borderColor: "#E85D54", // I-SHELF coral red
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FFF9F8", // Very light coral tint
  },

  uploadTextContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  uploadMainText: {
    fontSize: 15,
    marginBottom: 8,
  },

  uploadLink: {
    color: "#E85D54", // I-SHELF coral red
    fontWeight: "600",
  },

  uploadOr: {
    color: "#666",
  },

  uploadDrag: {
    color: "#333",
  },

  uploadSubText: {
    fontSize: 13,
    color: "#999",
  },

  fileSelectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  fileSelectedText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#FFD4D1", // Light coral border
  },

  continueButton: {
    height: 56,
    backgroundColor: "#E85D54", // I-SHELF coral red
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E85D54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});