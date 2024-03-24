import { folder } from './../../const';
import * as fs from 'react-native-fs'
import { action, configure, flow, makeAutoObservable, runInAction } from "mobx"
import { DEFAULT_COLUMNS, EXCLUDED_FOLDERS, files, SORT_BY, folders, toolbarType, SETTINGS, supportedFiles, SUPPORTED_FILES, file } from 'app/const'
import { Dimensions } from 'react-native'
import { getNameByPath, getParentPath, isHidden } from './helper';


// mobx use strict
configure({ enforceActions: 'always' })


class Store {

  columns = DEFAULT_COLUMNS

  folderColumns = this.columns
  filesColumns = 0

  excludedFolders = EXCLUDED_FOLDERS
  // supportedFilesExtension = [...SUPPORTED_FILES]

  scanning = null as 'folder' | 'all' | null

  files: files = {}
  selectedFilePaths: Set<string> = new Set()
  currentFileIndex = -1

  sortByFiles: Map<SORT_BY, Set<string>> = new Map()
  sortByFolders: Map<SORT_BY, Set<string>> = new Map()
  favouriteFilePaths: string[] = []

  folders: folders = {}
  selectedFolderPaths: Set<string> = new Set()
  currentFolderIndex = -1

  toolbarType: toolbarType | null = null

  selectionOn: boolean = false
  selectionCategory: toolbarType | null = null

  settings = SETTINGS

  constructor() {
    makeAutoObservable(this)
  }

  get itemSize() {
    return Math.floor(Dimensions.get('screen').width / this.columns)
  }

  getFileExtension(path: string) {
    let ext = path.split('.').pop()
    if (ext) {
      return ext as supportedFiles
    }
    return undefined
  }

  private addFile = flow(function* (this: Store, file: fs.StatResult) {
    if (!file.isFile() || this.files[file.originalFilepath]) { return }

    const ext = file.originalFilepath.split('.').pop()?.toLowerCase() as unknown as typeof SUPPORTED_FILES[number]
    if (!SUPPORTED_FILES.includes(ext)) { return }

    this.files[file.originalFilepath] = {
      ...file,
      name: file.name ?? getNameByPath(file.originalFilepath)
    }

    const parentFolderPath = getParentPath(file.originalFilepath)

    if (!this.folders[parentFolderPath]) {

      const parentFolderInfo = yield fs.stat(parentFolderPath)

      this.folders[parentFolderInfo.originalFilepath] = {
        ...parentFolderInfo,
        name: parentFolderInfo.name ?? getNameByPath(parentFolderInfo.originalFilepath),
        files: [file.originalFilepath]
      }
      return
    }

    this.folders[parentFolderPath].files.push(file.originalFilepath)
  })


  private setScanning(scanning: typeof this.scanning) {
    this.scanning = scanning
  }
  private async crawl(path: string, recurring: boolean = true) {

    if (
      this.excludedFolders.has(path) ||
      (!this.settings.showHiddenFolders && isHidden(path))
    ) { return }

    const pathInfo = await fs.stat(path)

    if (pathInfo.isDirectory()) {
      const directoryNames = await fs.readdir(path)

      for (const name of directoryNames) {

        const newPath = path + '/' + name
        if (!await fs.exists(newPath)) { continue }

        const newPathInfo = await fs.stat(newPath);

        (newPathInfo.isDirectory() && recurring) && await this.crawl(newPath, recurring)
        newPathInfo.isFile() && this.addFile(newPathInfo)
      }
    }

    pathInfo.isFile() && this.addFile(pathInfo)
  }

  async scan(path?: string) {

    const recurring = path ? false : true;
    this.setScanning(recurring ? 'all' : 'folder')

    if (!path) {
      let basePath = fs.DownloadDirectoryPath.split('/')
      basePath.pop()
      path = basePath.join('/')
    }

    await this.crawl(path, recurring)

    this.setScanning(null)
  }



  // scan = flow(function* (this: Store) {
  //   this.scanning = 'all'

  //   let basePath = fs.DownloadDirectoryPath.split('/')
  //   basePath.pop()
  //   yield this.crawl(basePath.join('/'))

  //   this.scanning = null
  // })

  // favourite(paths: string[]) { }
  // send(paths: string[]) { }
  // edit() {
  //   throw 'Not Implemented'
  // }
  // remove(paths: string[]) { }
  // rename(path: string, name: string) { }
  // setAsWallpaper(path: string) { }
  // details(path: string) { }
  // copy(paths: string[]) { }
  // move(paths: string[], destinationPath: string) { }
  // hide(paths: string[]) { }
}

export const store = new Store()