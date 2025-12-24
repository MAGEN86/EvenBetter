import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";

export async function getShareImageUri() {
  const asset = Asset.fromModule(require("../../assets/images/Foxy.png"));
  await asset.downloadAsync();

  const targetPath = FileSystem.cacheDirectory + "evenbetter-foxy.png";

  await FileSystem.copyAsync({
    from: asset.localUri || asset.uri,
    to: targetPath,
  });

  return targetPath; // file://...
}
