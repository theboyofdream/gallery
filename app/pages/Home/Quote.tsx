import { useStyles } from "@themes"
import { localStorage } from "@utils"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native"


const KEY = 'quote'
const QUOTE = { content: '', author: '', mtime: 0 }

export function Quote() {
  const { italic } = useStyles()
  const [quote, setQuote] = useState(QUOTE)

  function loadQuoteFromLocalStorage() {
    let quote = JSON.parse(localStorage.getString(KEY) ?? JSON.stringify(QUOTE)) as typeof QUOTE
    if (quote.mtime > 0 && quote.mtime < 1000 * 60 * 60 * 12) {
      setQuote(quote)
      return
    }
    fetchRandomQuote()
  }

  async function fetchRandomQuote() {
    await fetch('https://api.quotable.io/quotes/random?limit=1&maxLength=75')
      .then(response => response.json())
      .then(json => ({
        content: json[0].content,
        author: json[0].author,
        mtime: new Date().getTime()
      }))
      .then(q => {
        setQuote(q)
        localStorage.set(KEY, JSON.stringify(q))
      })
      .catch(console.error)
  }

  useEffect(loadQuoteFromLocalStorage, [])

  console.log('RENDER', 'Quote')

  return (
    <Pressable style={quoteBox} onPress={fetchRandomQuote}>
      <Text>{quote.content}</Text>
      <Text style={[italic]}>{quote.author && '~ '}{quote.author}</Text>
    </Pressable>
  )
}


const quoteBox = {
  opacity: 0.4,
  maxWidth: '90%'
} as ViewStyle