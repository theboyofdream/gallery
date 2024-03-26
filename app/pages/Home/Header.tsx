import { useStyles } from "@themes";
import { observer } from "mobx-react-lite";
import { PropsWithChildren } from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ViewStyle } from "react-native";



type HeaderProps = PropsWithChildren & {
  value: Animated.Value
}

export const Header = observer((props: HeaderProps) => {
  const MAX_HEIGHT = 450;
  const MIN_HEIGHT = 50;

  const { header } = useStyles()

  const height = props.value.interpolate({
    inputRange: [0, (MAX_HEIGHT - MIN_HEIGHT)],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp'
  })

  return (
    <Animated.View style={[header, { height }]}>
      {props.children}
    </Animated.View>
  )
})