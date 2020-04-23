import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts'
import { ScrollView } from 'react-native-gesture-handler';
import windowObject from '../constants/Layout';
import items from '../constants/LiquidAmounts'
import ButtonGrid from '../components/ButtonGrid';
import { addToDailyDrinkTotal, querySetting, getDailyDrinkTotal } from '../helpers/Database';
import * as Reminders from '../helpers/Reminders';

export default function HomeScreen({navigation,route}) {

  const [amount, setAmount] = React.useState(0)
  const [sum, setSum] = React.useState(0)
  const [goal, setGoal] = React.useState(0)

  React.useEffect(() => {
    setAmount(0)
    const getGoal = async () => {

      const theGoal = await querySetting('goal')
      setGoal(theGoal);
      const sum = await getDailyDrinkTotal()
      setAmount(sum / theGoal.toFixed(1));
      setSum(sum)
    }
    getGoal();
  }, [])

  React.useEffect(() => {
    const getGoal = async () => {
      const theGoal = await querySetting('goal')
      setGoal(theGoal);
      const sum = await addToDailyDrinkTotal(0, 'glass')
     
      const sum = await getDailyDrinkTotal()
      setAmount(sum / theGoal.toFixed(1));
      setSum(sum)
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getGoal();
    });
  
    return unsubscribe;
  }, [navigation, goal, sum]);

  const handleOnDrinkPress = async (num, type) => {
    const sum = await addToDailyDrinkTotal(num, type)
    setAmount(sum / goal.toFixed(1));
    setSum(sum)

    if ((sum / goal) > 1) {
      await Reminders.deleteAllQueuedReminders();
      await Reminders.queueRecurringTomorrowReminders(1);
    }
  }

  const color = (amount > 1) ? 'rgb(0, 150, 136)' : 'rgb(134, 65, 244)';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progress_circle_holder}>
        <ProgressCircle
          style={{ height: 320, width: windowObject.window.width - 40 }}
          progress={amount}
          progressColor={color}
          strokeWidth={15} />
        <View style={styles.progress_circle_info}>
          <Text style={{ ...styles.percent_amount, color }}>{Math.floor(amount * 100)}</Text>
          <Text style={{ ...styles.percent_indicator, color }}>{'%'}</Text>
          <View style={styles.divider}></View>
          <Text style={{ ...styles.water_amount, color }}>{sum}</Text>
          <Text style={{ ...styles.water_measurement, color }}>{'ml'}</Text>
        </View>
      </View>
      <ButtonGrid handleFunction={handleOnDrinkPress} items={items} />
      <Button title={'Settings'} onPress={()=>navigation.navigate('Settings')}></Button>
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
  progress_circle_holder: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress_circle_info: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  percent_amount: {
    padding: 0,
    margin: 0,
    fontSize: 40
  },
  percent_indicator: {
    padding: 0,
    margin: 0,
    fontSize: 30
  },
  water_amount: {
    padding: 0,
    margin: 0,
    fontSize: 40
  },
  water_measurement: {
    padding: 0,
    margin: 0,
    fontSize: 30
  },
  divider: {
    width: '50%',
    marginHorizontal: 'auto',
    height: 2,
    backgroundColor: '#eeeeee'
  }

});
