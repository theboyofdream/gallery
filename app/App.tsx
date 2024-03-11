import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
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


type files = { [key: string]: files }


export default function App() {

  async function handleStoragePermission() {
    if (!await Storage.hasPermission()) {
      await Storage.askPermissions()
    }
  }

  const [files, setFile] = useState<files>({})
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
    let files: files = {}
    if (excludePaths.includes(basePath)) {
      return files;
    }
    console.log({ basePath })
    if ((await fs.stat(basePath)).isDirectory()) {
      let ls = await fs.readdir(basePath)
      console.log({ ls })
      for (let name of ls) {
        let newPath = basePath + '/' + name
        console.log({ name, newPath })
        if (await fs.exists(newPath)) {
          let fileInfo = await fs.stat(newPath)
          if (fileInfo.isDirectory()) {
            files[name] = await getAllFiles(newPath)
          } else {
            files[name] = {}
          }
        }
      }
    }
    return files;
  }

  useEffect(() => {
    handleStoragePermission()
    // console.log('init')
    // FileLogger.info('init')
    // getAllFiles(getParentPath(fs.DownloadDirectoryPath))
    // .then(console.log)
    // .catch(console.error)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>files tree</Text>
    </SafeAreaView>
  )

  function Tree() {


  }
}
