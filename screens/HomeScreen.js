import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts'
import { ScrollView } from 'react-native-gesture-handler';
import windowObject from '../constants/Layout';
import items from '../constants/LiquidAmounts'
import ButtonGrid from '../components/ButtonGrid';
import { addToDailyDrinkTotal } from '../helpers/Database';

export default function HomeScreen() {

  const [amount, setAmount] = React.useState(0)

  React.useEffect(() => {
    setAmount(0)
  }, [])


  const handleOnDrinkPress = (num, type) => {
    let dbcall = addToDailyDrinkTotal(num, type)
    dbcall
      .then(sum => setAmount(sum / 2000.00))
      .catch(errorMsg => console.log("promise error ", errorMsg));
  }

  const color = (amount > 1) ? 'rgb(0, 150, 136)' : 'rgb(134, 65, 244)';

  return (
    <ScrollView style={styles.container}>

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
          style={{ height: 380, width: windowObject.window.width - 40 }}
          progress={amount}
          progressColor={color}
          strokeWidth={15}
        />
        <Text style={{...styles.water_amount, color: color}}>{amount}</Text>
      </View>

      <ButtonGrid handleFunction={handleOnDrinkPress} items={items} />
    </ScrollView>
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
  water_amount: {
    padding: 0,
    margin: 0,
    fontSize: 40,
    position: 'absolute',
    textAlign: 'center'
  },
  progress_circle_holder: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

});
