import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from '@tamagui/core';
import React, { PropsWithChildren, useMemo } from "react";
import config from '../tamagui.config';
import { Theme, useTheme } from 'tamagui';
import { useColorScheme } from 'react-native';


export function Provider(props: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <ApplyTheme>
          {props.children}
        </ApplyTheme>
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}


function ApplyTheme(props: PropsWithChildren) {
  const colorScheme = useColorScheme()
  const themeName = useMemo(() => {
    // if(colorScheme === 'light'){
    //   return 'light'
    // }
    return colorScheme
  }, [colorScheme])

  return (
    <Theme name={themeName}>
      {props.children}
    </Theme>
  )
}