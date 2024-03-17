import { PermissionsAndroid, Platform } from "react-native"


export const permissionStrings = {
  read: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  write: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  // manage: PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
}

export async function hasPermission() {
  if (Platform.OS != 'android') {
    return false;
  }
  let hasReadPermission = await PermissionsAndroid.check(permissionStrings.read)
  let hasWritePermission = await PermissionsAndroid.check(permissionStrings.write)
  // let hasManagePermission = await PermissionsAndroid.check(Storage.permissionStrings.manage)
  return hasReadPermission && hasWritePermission // && hasManagePermission;
}

export async function askPermissions() {
  let grantedReadPermission = await PermissionsAndroid.request(permissionStrings.read) === 'granted'
  let grantedWritePermission = await PermissionsAndroid.request(permissionStrings.write) === 'granted'
  // let grantedManagePermission = await PermissionsAndroid.request(Storage.permissionStrings.manage) === 'granted'
  return grantedReadPermission && grantedWritePermission // && grantedManagePermission;
}
