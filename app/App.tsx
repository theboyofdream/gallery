import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, RefreshControl, SafeAreaView, ScrollView, Text, View, useWindowDimensions } from "react-native";
import * as fs from 'react-native-fs'
import { hasPermission, askPermissions } from "./permission";
import { FileLogger } from "react-native-file-logger";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";


// FileLogger.configure({
//   maximumFileSize: 1024 * 1024 * 1, //(1 MB)
//   maximumNumberOfFiles: 5,
//   logsDirectory: '/logs',
//   captureConsole: true
// });
// FileLogger.enableConsoleCapture()


// const log = {
//   info: (...param: any) => {
//     FileLogger.info(JSON.stringify(param))
//   }
// }

type file = {
  name: string,
  path: string,
  size: number,
  ctime: number,
  mtime: number,
}
type files = { [filePath: string]: file }
type folder = {
  name: string,
  path: string,
  size: number,
  ctime: number,
  mtime: number,
  files: string[]
}
type folders = { [folderPath: string]: folder }


const excludePaths = [
  '/storage/emulated/0/Android/obb',
  '/storage/emulated/0/Android/data',
]
const extensions = ['jpg', 'jpeg', 'png', 'gif']

export default function App() {

  async function handleStoragePermission() {
    if (!await hasPermission()) {
      await askPermissions()
    }
  }

  const [folders, setFolders] = useState<folders>({})
  const [files, setFiles] = useState<files>({})
  const [scanning, setScanning] = useState(false)

  function getParentPath(path: string) {
    let paths = path.split('/')
    paths.pop()
    return paths.join('/')
  }
  async function getParentInfo(path: string) {
    let info = await fs.stat(getParentPath(path))
    if (!info.name || info.name.length < 1) {
      info.name = info.originalFilepath.split('/').pop()
    }
    return info
  }
  async function getAllFiles(basePath: string) {
    setScanning(true)
    let _folders = {} as folders
    let _files = {} as files

    async function scan(basePath: string) {
      if (excludePaths.includes(basePath)) {
        return;
      }
      // console.log({ basePath })
      if ((await fs.stat(basePath)).isDirectory()) {
        let ls = await fs.readdir(basePath)
        // console.log({ ls })
        for (let name of ls) {
          let newPath = basePath + '/' + name
          // console.log({ name, newPath })
          if (await fs.exists(newPath)) {
            let fileInfo = await fs.stat(newPath)
            if (!fileInfo.name || fileInfo.name.length < 1) {
              fileInfo.name = fileInfo.originalFilepath.split('/').pop()
            }
            if (fileInfo.isDirectory()) {
              // _folders[newPath] = {
              //   name: fileInfo.name ?? '',
              //   path: fileInfo.originalFilepath,
              //   ctime: fileInfo.ctime,
              //   mtime: fileInfo.mtime,
              //   size: fileInfo.size,
              //   files: []
              // }
              await scan(newPath)
            } else {
              // fls[name] = {}
              let ext = newPath.split('.').pop()?.toLowerCase()
              // console.log(ext, extensions.includes(ext ?? ''))
              if (ext && extensions.includes(ext)) {
                let parentPath = getParentPath(newPath)

                if (!_folders[parentPath]) {
                  let parentInfo = await getParentInfo(newPath)
                  _folders[parentPath] = {
                    name: parentInfo.name ?? '',
                    path: parentInfo.originalFilepath,
                    ctime: parentInfo.ctime,
                    mtime: parentInfo.mtime,
                    size: parentInfo.size,
                    files: []
                  }
                }

                if (_folders[parentPath]) {
                  _folders[parentPath].files.push(newPath)
                  _files[newPath] = {
                    name: fileInfo.name ?? '',
                    path: fileInfo.originalFilepath,
                    ctime: fileInfo.ctime,
                    mtime: fileInfo.mtime,
                    size: fileInfo.size
                  }
                }
              }
            }
          }
        }
      }
      // return fls;
    }

    // let _f = {} as folders
    // Object.values(_folders).map(f => {
    //   if (f.files.length > 0) {
    //     _f[f.path] = f;
    //   }
    // })

    await scan(basePath);

    // console.log(_folders)
    setFolders(_folders)
    // setFolders(_f)
    setFiles(_files)
    setScanning(false)
  }

  useEffect(() => {
    handleStoragePermission()
    // console.log('init')
    // FileLogger.info('init')
    getAllFiles(getParentPath(fs.DownloadDirectoryPath))
    // .then(console.log)
    // .catch(console.error)
  }, [])

  const [activeFolderPath, setActiveFolderPath] = useState('')
  const [activeFilesPath, setActiveFilePaths] = useState<string[]>([])
  useEffect(() => {
    console.log(activeFolderPath)
    if (activeFolderPath.length > 0 && folders[activeFolderPath] && folders[activeFolderPath].files.length > 0) {
      setActiveFilePaths(folders[activeFolderPath].files)
    }
  }, [activeFolderPath])

  const { width } = useWindowDimensions()
  const columns = 3;
  const [cardSize, setCardSize] = useState(Math.floor(width / columns))

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: cardSize }}>
        <FlashList
          data={Object.values(folders)}
          // extraData={folders}
          estimatedItemSize={cardSize}
          renderItem={({ item }) => {
            const f = item
            // console.log(item)
            return (
              <Pressable onPress={() => { setActiveFolderPath(f.path) }}>
                <Image source={{ uri: 'file://' + f.files[0] }} width={cardSize} height={cardSize} progressiveRenderingEnabled />
                {/* <Text>name: {f.name}</Text> */}
                <Text>{f.name}</Text>
                {/* <Text>path: {f.path}</Text> */}
              </Pressable>
            )
          }}
          refreshing={scanning}
          onRefresh={() => getAllFiles(getParentPath(fs.DownloadDirectoryPath))}
        />
      </View>
      <MasonryFlashList
        data={activeFilesPath}
        numColumns={columns - 1}
        estimatedItemSize={cardSize}
        renderItem={({ item }) => {
          const f = files[item]
          return (
            <Image source={{ uri: 'file://' + f.path }} width={cardSize} height={cardSize} />
          )
        }}
      />
    </SafeAreaView>
  )
}
