import { observer } from "mobx-react-lite";
import { Screen } from 'react-native-screens';

import { observable } from "mobx";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useStyles } from '../../themes';
import { H1, H6, Header, Paragraph, Text } from "tamagui";


const state = observable({
})

export const HomePage = observer(() => {
  const { screen, header } = useStyles()

  return (
    <Screen style={screen}>
      <View style={header}>
        <H1>Gallery</H1>
        <Quote />
      </View>
    </Screen>
  )
})



function Quote() {
  const { italic } = useStyles()
  const [quote, setQuote] = useState({ content: '', author: '' })

  async function fetchRandomQuote() {
    await fetch('https://api.quotable.io/quotes/random?limit=1&maxLength=100')
      .then(response => response.json())
      .then(json => ({
        content: json[0].content,
        author: json[0].author
      }))
      .then(setQuote)
  }

  useEffect(() => {
    fetchRandomQuote()
  }, [])

  console.log('RENDER', 'Quote')

  return (
    <Pressable style={{ opacity: 0.4, maxWidth: '90%' }} onPress={fetchRandomQuote}>
      <Text>{quote.content}</Text>
      <Text style={[italic]}>{quote.author && '~ '}{quote.author}</Text>
    </Pressable>
  )
}