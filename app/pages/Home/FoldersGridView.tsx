import { FlashListProps, MasonryFlashList, MasonryFlashListProps } from "@shopify/flash-list";
import { observer } from "mobx-react-lite";
import { store } from "./state";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable } from "react-native";
import { Image, Paragraph, Spacer, Text } from "tamagui";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { action } from "mobx";
import { MAX_COLUMNS } from "app/const";


const actions = {
  pinch: action(() => {
    if (store.columns != 1)
      store.columns -= 1
  }),
  pan: action(() => {
    if (store.columns < MAX_COLUMNS)
      store.columns += 1
  }),
  press: action((path: string) => {
    if (!store.selectionOn) {
      store.folderColumns = 1
      store.filesColumns = store.columns - 1

      store.activeFolderPath = path
      return;
    }

    store.selectedFolderPaths.has(path) ?
      store.selectedFolderPaths.delete(path) :
      store.selectedFolderPaths.add(path)

    if (store.selectedFilePaths.size == 1) {
      store.selectionCategory = 'folder'
    }
    if (store.selectedFilePaths.size > 1) {
      store.selectionCategory = 'folders'
    }
  }),
  longPress: action((path: string) => {
    if (store.selectionOn) { return }

    store.selectionOn = true
    store.selectionCategory = 'folder'

    store.selectedFolderPaths.add(path)
  })
}



export const FoldersGridView = observer((props: {
  scrollEventThrottle?: number | undefined,
  onScroll?: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
}) => {

  const pinch = Gesture.Pinch()
    .onFinalize(e => {
      const { scale } = e
      scale < 1 && actions.pinch()
      scale > 1 && actions.pan()
    })

  // console.log(Object.keys(store.folders).length)

  return (
    <>
      {
        !store.activeFolderPath &&
        // <GestureDetector gesture={pinch}>
        <MasonryFlashList
          ListFooterComponent={<Spacer size={100} />}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={props.scrollEventThrottle}
          onScroll={props.onScroll}
          numColumns={store.folderColumns}
          data={Object.values(store.folders)}
          estimatedItemSize={store.itemSize}
          extraData={[
            store.folderColumns,
            store.activeFolderPath,
            store.currentFolderIndex
          ]}
          renderItem={({ item: { name, files, path } }) => {
            // console.log(name)
            return (
              <Folder
                name={name}
                filesCount={files.length}
                path={path}
                thumbnailPath={store.files[files[0]].path}
              />
            )
          }}
          refreshing={store.scanning === 'all'}
          onRefresh={store.scan}
        />
        // </GestureDetector>
      }
    </>
  )
})


const Folder = observer((props: {
  name: string,
  path: string,
  filesCount: number,
  thumbnailPath: string,
}) => {
  return (
    <Pressable
      onPress={() => actions.press(props.path)}
      onLongPress={() => actions.longPress(props.path)}
    >
      <Image
        // defaultSource={{ uri: `https://craftypixels.com/placeholder-image/${store.itemSize}/000000/0011ff&text=+` }}
        source={{ uri: 'file://' + props.thumbnailPath }}
        width={store.itemSize}
        height={store.itemSize}
      />
      <Paragraph>
        <Text numberOfLines={1} ellipse>{props.name}</Text>
        <Text numberOfLines={1} ellipse style={{ opacity: 0.5 }}>{props.filesCount}</Text>
      </Paragraph>
    </Pressable>
  )
})