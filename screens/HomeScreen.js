import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ProgressChart } from "react-native-chart-kit";
import { MonoText } from '../components/StyledText';
import windowObject from '../constants/Layout';

import { addToDailyDrinkTotal } from '../helpers/Database'

export default function HomeScreen() {

  const [amount, setAmount] = React.useState(0)

  React.useEffect(() => {
    setAmount(0)
  }, [])

  const data = {
    labels: ["Goal", "Amount"], // optional
    data: [0.6, amount]
  };
  const chartConfig = {
    backgroundColor: '#3abbac',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#000000',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 5,
    }
  }

  const handleOnDrinkPress = () => {
    console.log("amount ", amount)
    let dbcall = addToDailyDrinkTotal(amount)
    dbcall
      .then(sum => setAmount(sum/2000))
      .catch(errorMsg => console.log("promise error ", errorMsg));

    
    
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View> */}

        <View style={styles.getStartedContainer}>
          <ProgressChart
            data={data}
            width={windowObject.window.width}
            height={220}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>

        <TouchableOpacity onPress={handleOnDrinkPress}><Text style={styles.drink_button}>I drank</Text></TouchableOpacity>
      </ScrollView>


    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  drink_button: {
    padding: 10
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
