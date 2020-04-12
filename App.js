import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Database from './helpers/Database';
import * as Notifications from './helpers/Notifications';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [pushNotificationToken, setPushNotificationToken] = React.useState('');
  // ExponentPushToken[AGpAbsEP-jLF6l5HPMIYN_]
  const [notification, setNotification] = React.useState({});
  const [notificationSubscription, setNotificationSubscription] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
 
  
  

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });

        setPushNotificationToken(await Notifications.registerForPushNotificationsAsync());

        // setNotificationSubscription(Notifications.notificationListener);

        Database.dropTables();
        Database.init();
        let dbcall = Database.queryEntries('week'); // 'day', 'week', 'month'
        dbcall
          .then(entries => null) //console.log('water entries from db: ', entries))
          .catch(errorMsg => console.log("entries promise error ", errorMsg));


      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
