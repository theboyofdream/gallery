import { makeAutoObservable } from 'mobx'
import { COLUMNS, EXCLUDED_FOLDERS, SUPPORTED_FILES_EXTENSION } from "./config"


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


class Store {

  columns = COLUMNS
  excludedFolders: string[] = [...EXCLUDED_FOLDERS]
  supportedFilesExtension: string[] = [...SUPPORTED_FILES_EXTENSION]

  scanning = false

  files: files = {}
  filePaths: string[] = []
  selectedFilePaths: string[] = []
  currentFileIndex = -1

  folders: folders = {}
  folderPaths: string[] = []
  selectedFolderPaths: string[] = []
  currentFolderIndex = -1

  toolbarType: toolbarType | null = null
  selectionCategory: toolbarType | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get totalFilesCount() {
    return Object.keys(this.files).length
  }

  get filesCountByType() {
    return
  }

  get storageUsedByType() {
    return
  }

  get totalFoldersCount() {
    return Object.keys(this.folders).length
  }
}