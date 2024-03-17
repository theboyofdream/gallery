import * as fs from 'react-native-fs'
import { makeAutoObservable } from 'mobx'


export const COLUMNS = 3
export const MIN_CARD_SIZE = 100


type file = {
  name: string,
  path: string,
  size: number,
  ctime: number,
  mtime: number,
}
type files = { [filePath: string]: file }
type folder = file & { files: string[] }
type folders = { [folderPath: string]: folder }

type toolbarType = 'file' | 'files' | 'folder' | 'folders'
type toolbarOptions = 'send' | 'favourite' | 'edit' | 'delete' | 'rename' | 'set as wallpaper' | 'move' | 'details' | 'copy' | 'hide' | 'select all' | 'merge'
export const TOOLBAR_VARIANTS: { [k in toolbarType]: toolbarOptions[] } = {
  'file': [],
  'files': [],
  'folder': [],
  'folders': []
}

type settings = {
  autoPlayGIFs: boolean,
  autoPlayVideoWithSound: boolean,
  autoPlayVideoWithoutSound: boolean,
  excludedFolders: string[],
  useRecycleBin: boolean,
  theme: 'light' | 'dark' | 'system',
}
const SETTINGS: settings = {
  autoPlayGIFs: true,
  autoPlayVideoWithSound: false,
  autoPlayVideoWithoutSound: false,
  excludedFolders: [],
  useRecycleBin: true,
  theme: 'system',
}

const EXCLUDED_FOLDERS = [
  '/storage/emulated/0/Android/obb',
  '/storage/emulated/0/Android/data',
] as const
// type EXCLUDED_FOLDERS = typeof EXCLUDED_FOLDERS[number]

const SUPPORTED_FILES_EXTENSION = [
  'png', 'jpg', 'jpeg', 'gif'
] as const
type SUPPORTED_FILES_EXTENSION = typeof SUPPORTED_FILES_EXTENSION[number]


class Store {

  columns = COLUMNS
  excludedFolders: string[] = [...EXCLUDED_FOLDERS]
  supportedFilesExtension: string[] = [...SUPPORTED_FILES_EXTENSION]

  scanning = false

  files: files = {}
  filePaths: string[] = []
  selectedFilePaths: string[] = []
  currentFileIndex = -1

  favouriteFilePaths: string[] = []

  folders: folders = {}
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
      bytes += this.files[path].size
    }
    return bytes
  }

  get filesCountByType() {
    let counts = {} as { [k in SUPPORTED_FILES_EXTENSION]: number }
    for (let path in this.files) {
      let ext = this.getFileExtension(path)
      if (ext && SUPPORTED_FILES_EXTENSION.includes(ext)) {
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
    let bytes = {} as { [k in SUPPORTED_FILES_EXTENSION]: number }
    for (let path in this.files) {
      let ext = this.getFileExtension(path)
      if (ext && SUPPORTED_FILES_EXTENSION.includes(ext)) {
        if (bytes[ext]) {
          bytes[ext] += this.files[path].size
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
      return ext as SUPPORTED_FILES_EXTENSION
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