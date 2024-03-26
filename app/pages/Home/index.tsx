import { observer } from "mobx-react-lite";
import { Screen } from 'react-native-screens';

import { action, observable, runInAction } from "mobx";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, RefreshControl, View } from "react-native";
import { useStyles } from '@themes';
import { H1, H2, H4, H5, H6, Image, Paragraph, ScrollView, Spacer, Text } from "tamagui";
import { MasonryFlashList } from "@shopify/flash-list";
import { store } from "./state";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { MAX_COLUMNS } from "app/const";
import { Quote } from "./Quote";
import { FoldersGridView } from "./FoldersGridView";
import { FilesGridView } from "./FilesGridView";
import { Header } from "./Header";


const actions = {
  leftSwipe: action(() => {
    if (!store.activeFolderPath) {
      store.activeFolderPath = Object.keys(store.folders)[0]

      store.folderColumns = 1
      store.filesColumns = store.columns - 1
      return;
    }
    store.folderColumns = 0
    store.filesColumns = store.columns
  }),
  rightSwipe: action(() => {
    if (store.folderColumns === 0) {
      store.folderColumns = 1
      store.filesColumns = store.columns - 1
      return;
    }
    store.folderColumns = store.columns
    store.filesColumns = 0
  }),
}

export const HomePage = observer(() => {
  const { screen, header, row } = useStyles()

  const scrollOffsetY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (Object.keys(store.folders).length < 1) {
      store.scan()
    }
  }, [])


  const leftSwipeGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .numberOfPointers(1)
    .onFinalize(actions.leftSwipe)
  const rightSwipeGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .numberOfPointers(1)
    .onFinalize(actions.rightSwipe)
  const swipeGesture = Gesture.Simultaneous(leftSwipeGesture, rightSwipeGesture)

  return (
    <Screen style={screen}>

      <Header value={scrollOffsetY}>
        <View style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center'
        }}>
          <H1>Gallery</H1>
          <Quote />
        </View>
      </Header>


      <FoldersGridView
        scrollEventThrottle={15}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
      />

      {/* <GestureDetector gesture={swipeGesture}>
        <View style={row}>
          <FoldersGridView
            scrollEventThrottle={15}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
              { useNativeDriver: false }
            )}
          />
          <FilesGridView />
        </View>
      </GestureDetector> */}
    </Screen>
  )
})








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