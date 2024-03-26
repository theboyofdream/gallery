import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { getTokens, useTheme } from "tamagui";

export function useStyles() {
  const theme = useTheme()
  const { size, space, radius, zIndex } = getTokens()

  const styles = useMemo(() => StyleSheet.create(({
    screen: {
      flex: 1,
      minHeight: '100%',
      minWidth: '100%',
      backgroundColor: theme.background.get(),
      // backgroundColor: theme.accentColor.get()
    },
    header: {
      // height: '50%',
      // maxHeight: 450,
      padding: space.$3.val,
      paddingHorizontal: space.$5.val,
      // justifyContent: 'center'
    },
    row: {
      flexDirection: 'row'
    },
    italic: {
      fontStyle: 'italic'
    }
  })), [theme])

  return { ...styles }
}