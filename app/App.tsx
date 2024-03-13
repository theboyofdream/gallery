import { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import * as fs from 'react-native-fs'
import Storage from "./storage";
import { FileLogger } from "react-native-file-logger";


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


export default function App() {

  async function handleStoragePermission() {
    if (!await Storage.hasPermission()) {
      await Storage.askPermissions()
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
  const excludePaths = [
    '/storage/emulated/0/Android/obb',
    '/storage/emulated/0/Android/data',
  ]
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
              // if(_folders[name])
              // fls[name] = await scan(newPath)
              // console.log(fileInfo.originalFilepath)
              _folders[newPath] = {
                name: fileInfo.name ?? '',
                path: fileInfo.originalFilepath,
                ctime: fileInfo.ctime,
                mtime: fileInfo.mtime,
                size: fileInfo.size,
                files: []
              }
              await scan(newPath)
            } else {
              // fls[name] = {}
              _folders[getParentPath(newPath)].files.push(newPath)
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
      // return fls;
    }

    await scan(basePath);

    // console.log(_folders)
    setFolders(_folders)
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>files tree</Text>
      {/* <FlatList
        maxToRenderPerBatch={10}
        data={Object.keys(files)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          let file = files[item]
          return (
            <View style={{ padding: 24, paddingVertical: 12 }}>
              <Image
                src={'file://' + file.path}
                width={100}
                height={100}
              />
              <Text>name: {file.name}</Text>
              <Text>path: {file.path}</Text>
            </View>
          )
        }}
        refreshControl={
          <RefreshControl
            refreshing={scanning}
            onRefresh={() => getAllFiles(getParentPath(fs.DownloadDirectoryPath))}
          />
        }
      /> */}
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={scanning}
              onRefresh={() => getAllFiles(getParentPath(fs.DownloadDirectoryPath))}
            />
          }
        >
          {
            Object.values(files).map(f =>
              <View style={{ padding: 24, paddingVertical: 12 }} key={f.path}>
                <Text>name: {f.name}</Text>
                <Text>path: {f.path}</Text>
              </View>
            )
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
