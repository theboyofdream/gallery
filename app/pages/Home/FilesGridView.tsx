import { MasonryFlashList } from "@shopify/flash-list";
import { observer } from "mobx-react-lite";
import { store } from "./state";
import { Pressable } from "react-native";
import { Image, Paragraph, Text } from "tamagui";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { action } from "mobx";
import { MAX_COLUMNS } from "app/const";
import { getParentPath } from "./helper";


const actions = {
  pinch: action(() => {
    if (store.filesColumns != 1) {
      store.filesColumns -= 1
    }
  }),
  pan: action(() => {
    if (store.folderColumns > 0 && store.filesColumns < MAX_COLUMNS - store.folderColumns) {
      store.filesColumns += 1
    } else if (store.filesColumns < MAX_COLUMNS) {
      store.filesColumns += 1
    }
  }),
  press: action((path: string) => {
    if (!store.selectionOn) {
      // store.folderColumns = 1
      // store.filesColumns = store.columns - 1

      store.activeFilePath = path
      return;
    }

    store.selectedFilePaths.has(path) ?
      store.selectedFilePaths.delete(path) :
      store.selectedFilePaths.add(path)

    if (store.selectedFilePaths.size == 1)
      store.selectionCategory = 'file'

    if (store.selectedFilePaths.size > 1)
      store.selectionCategory = 'files'
  }),
  longPress: action((path: string) => {
    if (store.selectionOn) { return }

    store.selectionOn = true
    store.selectionCategory = 'file'

    store.selectedFilePaths.add(path)
  }),
  refresh: () => {
    if (store.activeFolderPath)
      store.scan(getParentPath(store.activeFolderPath))
  }
}

export const FilesGridView = observer(() => {

  const pinch = Gesture.Pinch()
    .onFinalize(e => {
      const { scale } = e
      scale < 1 && actions.pinch()
      scale > 1 && actions.pan()
    })

  return (
    <>
      {
        store.activeFolderPath &&
        <GestureDetector gesture={pinch}>
          <MasonryFlashList
            numColumns={store.filesColumns}
            data={Object.keys(store.folders[store.activeFolderPath].files)}
            estimatedItemSize={store.itemSize}
            extraData={[
              store.activeFolderPath,
              store.currentFolderIndex
            ]}
            renderItem={({ item }) => {
              const { name, path } = store.files[item]
              return (
                <File
                  name={name}
                  path={path}
                />
              )
            }}
            refreshing={store.scanning === 'all'}
            onRefresh={actions.refresh}
          />
        </GestureDetector>
      }
    </>
  )
})


const File = observer((props: {
  name: string,
  path: string,
}) => {
  return (
    <Pressable
      onPress={() => actions.press(props.path)}
      onLongPress={() => actions.longPress(props.path)}
    >
      <Image
        // defaultSource={{ uri: `https://craftypixels.com/placeholder-image/${store.itemSize}/000000/0011ff&text=+` }}
        source={{ uri: 'file://' + props.path }}
        width={store.itemSize}
        height={store.itemSize}
      />
    </Pressable>
  )
})