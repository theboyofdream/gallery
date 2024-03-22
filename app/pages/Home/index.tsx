import { observer } from "mobx-react-lite";
import { Screen } from 'react-native-screens';

import { action, observable, runInAction } from "mobx";
import { useEffect, useRef, useState } from "react";
import { Pressable, RefreshControl, View } from "react-native";
import { useStyles } from '@themes';
import { H1, H6, Header, Image, Paragraph, Text } from "tamagui";
import { MasonryFlashList } from "@shopify/flash-list";
import { store } from "./state";
import { Gesture, GestureDetector } from "react-native-gesture-handler";


export const HomePage = observer(() => {
  const { screen, header, row } = useStyles()

  useEffect(() => {
    if (store.folders.size < 1)
      store.scan()
  }, [])

  // console.log(store.folders)
  let g = useRef({ x: 0, y: 0, velocity: 0 })

  const pinch = Gesture.Pinch()
  // .config({})
  // pinch.onBegin(e => {
  //   if (e.numberOfPointers === 2)
  //     g.current = {
  //       x: e.focalX,
  //       y: e.focalY,
  //       velocity: e.velocity
  //     }
  // })
  // pinch.onEnd(e => {
  //   if (e.numberOfPointers === 2){
  //     if
  //   }
  //     g.current = {
  //       x: e.focalX,
  //       y: e.focalY,
  //       velocity: e.velocity
  //     }
  // })
  pinch.onFinalize(e => {
    const { numberOfPointers, scale, velocity } = e
    runInAction(() => {
      console.log(velocity)
      if (velocity < 0) {
        store.columns += 1
      } else if (velocity > 0) {
        store.columns -= 1
      }
    })
    // console.log({ numberOfPointers, scale, velocity }, e)
  })


  return (
    <GestureDetector gesture={pinch}>
      <Screen style={screen}>
        <View style={header}>
          <H1>Gallery</H1>
          <Quote />
        </View>
        <View style={row}>
          <MasonryFlashList
            numColumns={store.columns}
            data={Array.from(store.files.keys())}
            estimatedItemSize={store.itemSize}
            renderItem={({ item }) => {
              // if (store.folders.has(item)) {
              const folder = store.files.get(item)
              // console.log(folder?.path, store.itemSize)
              return (
                <View>
                  <Image
                    source={{ uri: 'file://' + folder?.path }}
                    width={store.itemSize}
                    height={store.itemSize}
                  />
                  {/* <Text></Text> */}
                </View>
              )
              // }
              // return undefined
            }}
            // refreshing={store.scanning}
            // onRefresh={store.scan}
            refreshControl={
              <RefreshControl
                refreshing={store.scanning}
                onRefresh={() => { store.scan() }}
              />
            }
          />
          {/* <MasonryFlashList 
        /> */}
        </View>
      </Screen>
    </GestureDetector>
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
