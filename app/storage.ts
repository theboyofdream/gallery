import { PermissionsAndroid, Platform } from "react-native"


const Storage = {

  permissionStrings: {
    read: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    write: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    // manage: PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
  },

  hasPermission: async function () {
    if (Platform.OS != 'android') {
      return false;
    }
    let hasReadPermission = await PermissionsAndroid.check(Storage.permissionStrings.read)
    let hasWritePermission = await PermissionsAndroid.check(Storage.permissionStrings.write)
    // let hasManagePermission = await PermissionsAndroid.check(Storage.permissionStrings.manage)
    return hasReadPermission && hasWritePermission // && hasManagePermission;
  },

  askPermissions: async function () {
    let grantedReadPermission = await PermissionsAndroid.request(Storage.permissionStrings.read) === 'granted'
    let grantedWritePermission = await PermissionsAndroid.request(Storage.permissionStrings.write) === 'granted'
    // let grantedManagePermission = await PermissionsAndroid.request(Storage.permissionStrings.manage) === 'granted'
    return grantedReadPermission && grantedWritePermission // && grantedManagePermission;
  }

}


export default Storage;