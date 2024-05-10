import BaseLayout from "@components/baselayout"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native"
import { Divider, List } from "react-native-paper"
import { RootStackParamList } from "@router/type";
import { useTranslation } from "react-i18next";


const Agreement = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation()

  return <BaseLayout>
    <View className="bg-[#191919] rounded-2xl  m-5">
      <List.Item
        title={t('agreement.tag1')}
        right={props => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {
          navigation.navigate('UserRule')
        }}
      />
      <Divider />
      <List.Item
        title={t('agreement.tag2')}
        right={props => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {
          navigation.navigate('PrivacyRule')
        }}
      />
    </View>
  </ BaseLayout>
}


export default Agreement
