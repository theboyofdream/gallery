import * as fs from 'react-native-fs'
import { makeAutoObservable } from 'mobx'


export const COLUMNS = 3
export const MIN_CARD_SIZE = 100


// export const TOOLBAR_VARIANTS: { [k in toolbarType]: toolbarOptions[] } = {
//   'file': [],
//   'files': [],
//   'folder': [],
//   'folders': []
// }

// const SETTINGS: settings = {
//   autoPlayGIFs: true,
//   autoPlayVideoWithSound: false,
//   autoPlayVideoWithoutSound: false,
//   excludedFolders: [],
//   useRecycleBin: true,
//   theme: 'system',
// }

// const EXCLUDED_FOLDERS = [
//   '/storage/emulated/0/Android/obb',
//   '/storage/emulated/0/Android/data',
// ] as const
// type EXCLUDED_FOLDERS = typeof EXCLUDED_FOLDERS[number]

// const SUPPORTED_FILES = [
//   'png', 'jpg', 'jpeg', 'gif'
// ] as const
// type SUPPORTED_FILES_EXTENSION = typeof SUPPORTED_FILES_EXTENSION[number]


class Store {

  columns = COLUMNS
  excludedFolders: string[] = [...EXCLUDED_FOLDERS]
  supportedFilesExtension: string[] = [...SUPPORTED_FILES]

  scanning = false

  files: files = new Map()
  filePaths: string[] = []
  selectedFilePaths: string[] = []
  currentFileIndex = -1

  favouriteFilePaths: string[] = []

  folders: folders = new Map()
  folderPaths: string[] = []
  selectedFolderPaths: string[] = []
  currentFolderIndex = -1

  toolbarType: toolbarType | null = null
  selectionCategory: toolbarType | null = null

  settings: settings = { ...SETTINGS }

  constructor() {
    makeAutoObservable(this)
  }

  get totalFilesCount() {
    return Object.keys(this.files).length
  }

  get storageUsedByFiles() {
    let bytes = 0
    for (let path in this.files) {
      this.files.get(path)?.size
      bytes += this.files.get(path)?.size || 0
    }
    return bytes
  }

  get filesCountByType() {
    let counts = {} as { [k in supportedFiles]: number }
    for (let path in this.files) {
      let ext = this.getFileExtension(path)
      if (ext && SUPPORTED_FILES.includes(ext)) {
        if (counts[ext]) {
          counts[ext] += 1
        } else {
          counts[ext] = 0
        }
      }
    }
    return counts
  }

  get storageUsedByType() {
    let bytes = {} as { [k in supportedFiles]: number }
    for (let path in this.files) {
      let ext = this.getFileExtension(path)
      if (ext && SUPPORTED_FILES.includes(ext)) {
        if (bytes[ext]) {
          bytes[ext] += this.files.get(path)?.size || 0
        } else {
          bytes[ext] = 0
        }
      }
    }
    return bytes
  }

  get totalFoldersCount() {
    return Object.keys(this.folders).length
  }

  getFileExtension(path: string) {
    let ext = path.split('.').pop()
    if (ext) {
      return ext as supportedFiles
    }
    return undefined
  }

  scan() { }

  favourite(paths: string[]) { }
  send(paths: string[]) { }
  edit() {
    throw 'Not Implemented'
  }
  remove(paths: string[]) { }
  rename(path: string, name: string) { }
  setAsWallpaper(path: string) { }
  details(path: string) { }
  copy(paths: string[]) { }
  move(paths: string[], destinationPath: string) { }
  hide(paths: string[]) { }
}

export const store = new Store()