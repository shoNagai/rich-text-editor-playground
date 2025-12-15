import * as ImagePicker from "expo-image-picker";
import { readAsStringAsync } from "expo-file-system/legacy";

export type PickedImage = {
  uri: string;
  base64Uri: string;
  width: number;
  height: number;
};

export const pickImage = async (): Promise<PickedImage | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];

  // Convert to base64 for WebView compatibility
  const base64 = await readAsStringAsync(asset.uri, {
    encoding: "base64",
  });

  // Detect mime type from uri
  const extension = asset.uri.split(".").pop()?.toLowerCase() || "jpeg";
  const mimeType =
    extension === "png" ? "image/png" : extension === "gif" ? "image/gif" : "image/jpeg";

  return {
    uri: asset.uri,
    base64Uri: `data:${mimeType};base64,${base64}`,
    width: asset.width,
    height: asset.height,
  };
};
