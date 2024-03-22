import * as fs from 'react-native-fs'
import { makeAutoObservable, runInAction } from "mobx"
import { DEFAULT_COLUMNS, EXCLUDED_FOLDERS, files, SORT_BY, folders, toolbarType, SETTINGS, supportedFiles, SUPPORTED_FILES, file } from 'app/const'
import { Dimensions } from 'react-native'


class Store {

  columns = DEFAULT_COLUMNS
  excludedFolders = EXCLUDED_FOLDERS
  // supportedFilesExtension = [...SUPPORTED_FILES]

  scanning = false

  files: files = new Map()
  // filePaths: Set<string> = new Set()
  selectedFilePaths: Set<string> = new Set()
  currentFileIndex = -1

  sortByFiles: Map<SORT_BY, Set<string>> = new Map()
  sortByFolders: Map<SORT_BY, Set<string>> = new Map()
  favouriteFilePaths: string[] = []

  folders: folders = new Map()
  // folderPaths: Set<string> = new Set()
  selectedFolderPaths: Set<string> = new Set()
  currentFolderIndex = -1

  toolbarType: toolbarType | null = null
  selectionCategory: toolbarType | null = null

  settings = SETTINGS

  constructor() {
    // this.itemSize = Math.floor(Dimensions.get('screen').width / this.columns)
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

  setScanning(scanning: boolean) {
    this.scanning = scanning
  }

  // private addFile(params: file) {
  //   this.files.set(params.path, params)
  //   const parentPath = params.path.split('/').pop()
  //   if (parentPath && this.folders.has(parentPath)) {
  //     const parentFolder = this.folders.get(parentPath)
  //     if (parentFolder) {
  //       this.folders.set(parentPath, {
  //         ...parentFolder,
  //         files: [...parentFolder.files, params.path]
  //       })
  //     }
  //   }
  // }

  // private addFolder(params: folder) {
  //   if (!this.folders.has(params.path)) {
  //     this.folders.set(params.path, params)
  //   }
  // }


  async scan() {
    this.setScanning(true)

    let files: files = new Map()
    let sortByFiles: Map<SORT_BY, Set<string>> = new Map()

    let folders: folders = new Map()
    let sortByFolders: Map<SORT_BY, Set<string>> = new Map()

    const crawl = async (path: string) => {

      if (this.excludedFolders.has(path)) { return }

      const pathInfo = await fs.stat(path)
      if (pathInfo.isDirectory()) {
        const directoryNames = await fs.readdir(path)

        for (const name of directoryNames) {
          const newPath = path + '/' + name

          if (await fs.exists(newPath)) {
            const newPathInfo = await fs.stat(newPath)

            if (!newPathInfo.name || newPathInfo.name.length < 1) {
              newPathInfo.name = newPathInfo.originalFilepath.split('/').pop()
            }

            const info: file = {
              name: newPathInfo.name ?? '',
              path: newPathInfo.originalFilepath,
              size: newPathInfo.size,
              ctime: newPathInfo.ctime,
              mtime: newPathInfo.mtime,
            }

            if (newPathInfo.isDirectory() && !folders.has(newPath)) {
              folders.set(newPath, {
                ...info,
                files: new Set()
              })
              await crawl(newPath)
            } else if (newPathInfo.isFile() && !files.has(newPath)) {
              const ext = newPath.split('.').pop()?.toLowerCase() as unknown as typeof SUPPORTED_FILES[number]
              if (SUPPORTED_FILES.includes(ext)) {
                // const folder = folders.get(path)
                // if (folder) {
                //   folder.files.add(newPath)
                //   folders.set(path, folder)
                // }
                files.set(newPath, info)
              }
            }
          }
        }
      }
    }

    let basePath = fs.DownloadDirectoryPath.split('/')
    basePath.pop()
    await crawl(basePath.join('/'))

    runInAction(() => {
      this.files = files
      this.folders = folders

      this.sortByFiles
    })

    this.setScanning(false)
  }

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