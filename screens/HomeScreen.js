import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts'
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import windowObject from '../constants/Layout';

import { addToDailyDrinkTotal } from '../helpers/Database'

export default function HomeScreen() {

  const [amount, setAmount] = React.useState(0)

  React.useEffect(() => {
    setAmount(0)
  }, [])


  const handleOnDrinkPress = () => {
    let dbcall = addToDailyDrinkTotal(amount)
    dbcall
      .then(sum => setAmount(sum / 2000))
      .catch(errorMsg => console.log("promise error ", errorMsg));
  }

  return (
    <View style={styles.container}>

      {/* <View>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View> */}

      <View style={styles.progress_circle_holder}>
        <ProgressCircle
          progress={amount}
          progressColor={'rgb(134, 65, 244)'}
          strokeWidth={5}
       />

        <Text style={styles.water_amount}>{amount}</Text>
      </View>

      <TouchableOpacity onPress={handleOnDrinkPress}><Text style={styles.drink_button}>I drank</Text></TouchableOpacity>



    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};



const mainColor = 'rgb(134, 65, 244)'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  drink_button: {
    padding: 10
  },
  water_amount: {
    color: mainColor,
    padding: 0,
    margin: 0,
    fontSize: 40,
    position: 'absolute',
    textAlign: 'center'
  },
  progress_circle_holder: {
    position: 'relative',
    height: 350,
    width: windowObject.window.width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

});
