import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { Picker, StyleSheet, Text, View, Switch, TextInput, Button } from 'react-native';
import { queryAllSettings, updateSettings } from '../helpers/Database';
import * as Reminders from '../helpers/Reminders';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

const SettingsScreen = () => {

    const [settings, setSettings] = useState({})
    const [updated, toggleUpdated] = useState(false)
    const [timeout, updateTimeout] = useState(undefined)

    useEffect(() => {
        const asyncFunction = async () => {
            const fetchedSettings = await queryAllSettings();
            setSettings(fetchedSettings)
        }
        asyncFunction()
    }, [])

    useEffect(() => {
        clearTimeout(timeout)
        const asyncFunction = async () => {
            await updateSettings(settings.id, settings);
            await Reminders.deleteAllQueuedReminders();
            if (settings.frequency !== 'never') {
                hours = parseInt(settings.frequency.substring(0, 1));
                await Reminders.queueNonRecurringTodayReminders(hours);
                await Reminders.queueRecurringTomorrowReminders(hours);
            }
        }

        updateTimeout(setTimeout(() => {
            asyncFunction();
        }, 1000))

    }, [settings])

    return (
        <>
            {settings.hasOwnProperty('goal') &&
                <View style={styles.settingsScreen}>
                    <Button title={'Save'} onPress={() => updateSettings(settings.id, settings)} />
                    <Text>Daily Goal</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        value={settings.goal.toString()} onChange={e => {
                            setSettings({ ...settings, goal: parseInt(e.nativeEvent.text) })
                        }}
                        keyboardType={'number-pad'}
                    >
                    </TextInput>

                    <Text>Measurement Type</Text>
                    <Picker
                        selectedValue={settings.measurement}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {
                            setSettings({ ...settings, measurement: itemValue })
                        }}
                    >
                        <Picker.Item label="mL" value="ml" />
                        <Picker.Item label="oz" value="oz" />
                    </Picker>

                    <Text>Notification Frequency</Text>
                    <Picker
                        selectedValue={settings.frequency}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {
                            setSettings({ ...settings, frequency: itemValue })
                        }}
                    >
                        <Picker.Item label="Never" value="0h" />
                        <Picker.Item label="Hourly" value="1h" />
                        <Picker.Item label="Every 2 hours" value="2h" />
                        <Picker.Item label="Every 3 hours" value="3h" />
                    </Picker>

                    <Text>Remind me on Mondays</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={!!settings.monday ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={e => {
                            setSettings({ ...settings, monday: e ? 1 : 0 })
                        }}
                        value={!!settings.monday}
                    />

                    <Text>Start Time</Text>
                    <Picker
                        selectedValue={settings.startTime}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => {
                            setSettings({ ...settings, startTime: itemValue })
                        }}
                    >
                        <Picker.Item label="8am" value="08:00:00" />
                        <Picker.Item label="9am" value="09:00:00" />
                        <Picker.Item label="10am" value="10:00:00" />
                        <Picker.Item label="11am" value="11:00:00" />
                        <Picker.Item label="12pm" value="12:00:00" />
                        <Picker.Item label="1pm" value="13:00:00" />
                        <Picker.Item label="2pm" value="14:00:00" />
                        <Picker.Item label="3pm" value="15:00:00" />
                        <Picker.Item label="4pm" value="16:00:00" />
                        <Picker.Item label="5pm" value="17:00:00" />
                        <Picker.Item label="6pm" value="18:00:00" />
                        <Picker.Item label="7pm" value="19:00:00" />
                        <Picker.Item label="8pm" value="20:00:00" />
                        <Picker.Item label="9pm" value="21:00:00" />
                        <Picker.Item label="10pm" value="22:00:00" />
                    </Picker>

                <Text>End Time</Text>
                <Picker
                    selectedValue={settings.endTime}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => {
                        setSettings({ ...settings, endTime: itemValue })
                    }}
                >
                    <Picker.Item label="8am" value="08:00:00" />
                    <Picker.Item label="9am" value="09:00:00" />
                    <Picker.Item label="10am" value="10:00:00" />
                    <Picker.Item label="11am" value="11:00:00" />
                    <Picker.Item label="12pm" value="12:00:00" />
                    <Picker.Item label="1pm" value="13:00:00" />
                    <Picker.Item label="2pm" value="14:00:00" />
                    <Picker.Item label="3pm" value="15:00:00" />
                    <Picker.Item label="4pm" value="16:00:00" />
                    <Picker.Item label="5pm" value="17:00:00" />
                    <Picker.Item label="6pm" value="18:00:00" />
                    <Picker.Item label="7pm" value="19:00:00" />
                    <Picker.Item label="8pm" value="20:00:00" />
                    <Picker.Item label="9pm" value="21:00:00" />
                    <Picker.Item label="10pm" value="22:00:00" />
                </Picker>
                </View>
            }
        </>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    settingsScreen: {

    }
})