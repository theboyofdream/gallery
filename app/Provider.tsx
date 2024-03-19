import { TamaguiProvider } from '@tamagui/core';
import { PropsWithChildren } from "react";
import config from '../tamagui.config';


export function Provider(props: PropsWithChildren) {
  return (
    <TamaguiProvider config={config}>
      {props.children}
    </TamaguiProvider>
  )
}