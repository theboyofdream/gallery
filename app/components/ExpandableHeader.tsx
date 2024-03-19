import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Animated, Easing, NativeScrollEvent, NativeSyntheticEvent, ViewStyle } from "react-native";


type ExpandableHEaderProps = ViewStyle & {
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}


const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export const ExpandableHeader = observer((props: ExpandableHEaderProps) => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    easing: Easing.ease,
    extrapolate: "clamp"
  });
  props.onScroll = (e) => {
    scrollOffsetY.setValue(Math.round(e.nativeEvent.contentOffset.y))

  }

  return (
    <Animated.View
      {...props}
      style={[
        { height: headerScrollHeight },
        props.style
      ]}
    />
  )
})