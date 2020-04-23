import React from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { BarChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'

const DayWeekGraph = ({ data, measures }) => {
    console.log("the daata measures", data, typeof measures[0])
    return (
        <View style={{ padding: 20 }}>
            {data &&
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 200 }}>
                    <YAxis
                        data={data}
                        contentInset={{ left: 10, right: 10 }}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value}`}
                    />
                    <View style={{ width: '85%' }}>
                        <BarChart
                            style={{ flex: 1 }}
                            data={data}
                            gridMin={0}
                            animated={true}
                            contentInset={{ top: 10, bottom: 10 }}
                            svg={{ fill: 'rgb(134, 65, 244)' }}
                        >
                            <Grid />
                        </BarChart>
                    </View>
                </View>
            }
            {measures &&
                <XAxis
                    style={{ marginHorizontal: '8%', width: '85%' }}
                    data={measures}
                    xAccessor={({ item }) => item}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
            }
        </View>

    )
}

export default DayWeekGraph;