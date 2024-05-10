import { Stack } from './index';
import FightwineDetail from '@pages/mainScreen/fightwine/detail';
import Launch from '@pages/mainScreen/fightwine/launch';
import LaunchWine from '@pages/mainScreen/fightwine/launchwine';
import Booths from '@pages/mainScreen/fightwine/booths';
import MyWineParty from '@pages/mainScreen/fightwine/mywineparty';
import { useTranslation } from 'react-i18next';

const LoginGroup = () => {
  const { t } = useTranslation();

  return <Stack.Group>
    <Stack.Screen name="Launch" options={{ title: t('default.titleList.Launch') }} component={Launch} />
    <Stack.Screen name="LaunchWine" options={{ title: t('default.titleList.LaunchWine') }} component={LaunchWine} />
    <Stack.Screen name="Booths" options={{ title: t('default.titleList.Booths') }} component={Booths} />
    <Stack.Screen name="FightwineDetail" options={{ title: t('default.titleList.FightwineDetail') }} component={FightwineDetail} />
    <Stack.Screen name="MyWineParty" options={{ title: t('default.titleList.MyWineParty') }} component={MyWineParty} />
  </Stack.Group>;
};

export default LoginGroup;
