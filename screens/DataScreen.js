import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { BarChart, XAxis, Grid } from 'react-native-svg-charts'
import { ScrollView } from 'react-native-gesture-handler';
import windowObject from '../constants/Layout';
import { addToDailyDrinkTotal, queryEntries } from '../helpers/Database';
import DayWeekGraph from '../components/DayWeekGraph';


export default function DataScreen({ navigation, route }) {

    const [data, setData] = React.useState([])
    const [measures, setMeasures] = React.useState([])
    const [timePeriod, setTimePeriod] = React.useState('day');
    const [dayCount, setDayCount] = React.useState(undefined)

    React.useEffect(() => {
        const getEntries = async () => {
            const { entries, dayCount } = await queryEntries(timePeriod)
            setData(entries.map(ent => ent.amount))
            setMeasures(entries.map(ent => ent.measure))
            setDayCount(dayCount);
        }

        const unsubscribe = navigation.addListener('focus', () => {
            getEntries()
        });

        return unsubscribe;

    }, [navigation, timePeriod])

    React.useEffect(() => {
        const getEntries = async () => {
            const { entries, dayCount } = await queryEntries(timePeriod)
            setData(entries.map(ent => ent.amount))
            setMeasures(entries.map(ent => ent.measure))
            setDayCount(dayCount);
        }
        getEntries()
    }, [timePeriod])

    return (
        <View>
            <Picker
                selectedValue={timePeriod}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setTimePeriod(itemValue)}
            >
                <Picker.Item label="Day" value="day" />
                <Picker.Item label="This Week" value="week" />
                <Picker.Item label="Month" value="month" />
            </Picker>
            {timePeriod !== 'month' &&
                <DayWeekGraph data={data} measures={measures} />
            }

            {timePeriod === 'month' &&
                <View>

                </View>
            }

        </View>
    )
}

