export type file = {
  name: string,
  path: string,
  size: number,
  ctime: number,
  mtime: number,
}
export type files = Map<string, file>


export type folder = file & { files: Set<string> }
export type folders = Map<string, folder>


export type toolbarType = 'file' | 'files' | 'folder' | 'folders'
export type toolbarOptions = 'send' | 'favourite' | 'edit' | 'delete' | 'rename' | 'set as wallpaper' | 'move' | 'details' | 'copy' | 'hide' | 'select all' | 'merge'
// const TOOLBAR_VARIANTS: Map<toolbarType, Set<toolbarOptions>> = {
// 'file': new Set<toolbarOptions>(),
// 'files': [],
// 'folder': [],
// 'folders': []
// }


export const EXCLUDED_FOLDERS = new Set([
  '/storage/emulated/0/Android/obb',
  '/storage/emulated/0/Android/data',
]) as Set<string>


export const SETTINGS = {
  autoPlayGIFs: true,
  autoPlayVideoWithSound: false,
  autoPlayVideoWithoutSound: false,
  excludedFolders: EXCLUDED_FOLDERS,
  useRecycleBin: true,
  theme: 'system' as 'light' | 'dark' | 'system',
}
export type settings = typeof SETTINGS


export const SUPPORTED_FILES = [
  'png', 'jpg', 'jpeg', 'gif'
] as const
export type supportedFiles = typeof SUPPORTED_FILES[number]


export const SORT_BY = [
  'name', 'size', 'date'
] as const
export type SORT_BY = typeof SORT_BY[number]


export const SORT_ORDER = [
  'asc', 'desc'
] as const
export type SORT_ORDER = typeof SORT_ORDER[number]


export const DEFAULT_COLUMNS = 4
export const MIN_COLUMNS = 1
export const MAX_COLUMNS = 6

export const MIN_CARD_SIZE = 100