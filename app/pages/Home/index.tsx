import { observer } from "mobx-react-lite";
import { Screen } from 'react-native-screens';

import { action, observable, runInAction } from "mobx";
import { useEffect, useRef, useState } from "react";
import { Pressable, RefreshControl, View } from "react-native";
import { useStyles } from '@themes';
import { H1, H2, H4, H5, H6, Header, Image, Paragraph, ScrollView, Text } from "tamagui";
import { MasonryFlashList } from "@shopify/flash-list";
import { store } from "./state";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { MAX_COLUMNS } from "app/const";


export const HomePage = observer(() => {
  const { screen, header, row } = useStyles()

  useEffect(() => {
    if (Object.keys(store.folders).length < 1) {
      // if (store.folders.size < 1)
      store.scan()
    }
  }, [])


  const pinch = Gesture.Pinch()
  pinch.onFinalize(e => {
    const { scale } = e
    runInAction(() => {
      if (scale < 1 && store.columns < MAX_COLUMNS) {
        store.columns += 1
      } else if (scale > 1 && store.columns != 1) {
        store.columns -= 1
      }
    })
  })

  const onFolderClick = action((i: number) => {
    store.currentFolderIndex = i
  })
  // console.log('files: ', store.files)

  return (
    // <ScrollView>
    <Screen style={screen}>
      {/* <View style={header}>
        <H1>Gallery</H1>
        <Quote />
      </View> */}
      <GestureDetector gesture={pinch}>
        <View style={row}>
          <View style={{
            flex: 1,
            minHeight: '100%',
            maxWidth: store.currentFolderIndex < 0 ? store.columns * store.itemSize : store.itemSize
          }}>
            <MasonryFlashList
              // numColumns={
              //   store.currentFolderIndex < 0 ?
              //     store.columns :
              //     1
              // }
              data={Object.keys(store.folders)}
              estimatedItemSize={store.itemSize}
              // optimizeItemArrangement
              // if `numColumns` is `3`, you can return `2` for `index 1` and `1` for the rest to achieve a `1:2:1` split by width.
              getColumnFlex={(items, index, maxColumns, extraData) => {
                return store.currentFolderIndex < 0 ?
                  store.columns :
                  1;
              }}
              extraData={[store.currentFolderIndex]}
              renderItem={({ item, index }) => {
                const folder = store.folders[item]
                const file = store.files[folder.files[0]]
                return (
                  <Pressable onPress={() => onFolderClick(index)}>
                    <Image
                      defaultSource={{ uri: `https://craftypixels.com/placeholder-image/${store.itemSize}/000000/0011ff&text=+` }}
                      source={{ uri: 'file://' + file?.path }}
                      width={store.itemSize}
                      height={store.itemSize}
                    />
                    <Paragraph numberOfLines={1} ellipse>{folder?.name}</Paragraph>
                  </Pressable>
                )
              }}
              refreshing={store.scanning === 'all'}
              onRefresh={store.scan}
            />
          </View>
          {store.currentFolderIndex >= 0 &&
            <View style={{
              flex: 1,
              minHeight: '100%',
              maxWidth: store.currentFolderIndex >= 0 ? (store.columns - 1) * store.itemSize : 0
            }}>
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
                refreshing={store.scanning === 'folder'}
                onRefresh={() => store.scan(Object.keys(store.folders)[store.currentFolderIndex])}
              />
            </View>
          }
          {/* <MasonryFlashList 
        /> */}
        </View>
      </GestureDetector>
    </Screen>
    // </ScrollView>
  )
})



function Quote() {
  const { italic } = useStyles()
  const [quote, setQuote] = useState({ content: '', author: '' })

  async function fetchRandomQuote() {
    await fetch('https://api.quotable.io/quotes/random?limit=1&maxLength=75')
      .then(response => response.json())
      .then(json => ({
        content: json[0].content,
        author: json[0].author
      }))
      .then(setQuote)
      .catch(console.error)
  }

  useEffect(() => {
    fetchRandomQuote()
  }, [])

  console.log('RENDER', 'Quote')

  return (
    <Pressable style={{ opacity: 0.4, maxWidth: '90%' }}
    // onPress={fetchRandomQuote}
    >
      <Text>{quote.content}</Text>
      <Text style={[italic]}>{quote.author && '~ '}{quote.author}</Text>
    </Pressable>
  )
}





// <MasonryFlashList
// numColumns={store.columns}
// data={Array.from(store.files.keys())}
// estimatedItemSize={store.itemSize}
// renderItem={({ item }) => {
//   const folder = store.files.get(item)
//   return (
//     <View>
//         <Image
//           source={{ uri: 'file://' + folder?.path }}
//           width={store.itemSize}
//           height={store.itemSize}
//           />
//       </View>
//     )
//   }}
//   refreshing={store.scanning}
//   onRefresh={store.scan}
//   />