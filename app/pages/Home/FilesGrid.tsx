import { MasonryFlashList } from "@shopify/flash-list";
import { files } from "app/const";
import { observer } from "mobx-react-lite";
import { store } from "./state";
import { Image, View } from "tamagui";


type FilesGridViewProps = {
  files: files
}

const FilesGridView = observer(() => {

  return (
    <MasonryFlashList
      numColumns={
        store.currentFolderIndex >= 0 ?
          store.columns - 1 :
          0
      }
      // showsVerticalScrollIndicator={false}
      extraData={[store.itemSize, store.currentFolderIndex]}
      data={Object.values(store.folders)[store.currentFolderIndex].files}
      estimatedItemSize={store.itemSize}
      renderItem={({ item }) => {
        console.log(store.files[item].path)
        return (
          <View>
            <Image
              source={{ uri: 'file://' + store.files[item].path }}
              width={store.itemSize}
              height={store.itemSize}
            />
          </View>
        )
      }}
    // refreshing={store.scanning}
    // onRefresh={store.scan}
    />
  )
})