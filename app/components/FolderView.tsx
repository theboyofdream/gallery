import { observer } from "mobx-react-lite";
import { Image, Text, View } from "tamagui";


export const FolderView = observer((props: folder) => {
  return (
    <View>
      <Image />
      <View>
        <Text>{props.name}</Text>
        <Text>{props.files.values()}</Text>
      </View>
    </View>
  )
})