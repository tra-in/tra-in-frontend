import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WaypointSelectScreen from '../screens/WaypointSelectScreen';
import TrainListScreen from '../screens/TrainListScreen';
import SeatSelectScreen from '../screens/SeatSelectScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="WaypointSelect">
      <Stack.Screen
        name="WaypointSelect"
        component={WaypointSelectScreen}
        options={{ title: '경유지 선택' }}
      />
      <Stack.Screen
        name="TrainList"
        component={TrainListScreen}
        options={{ title: '열차 조회' }}
      />
      <Stack.Screen
        name="SeatSelect"
        component={SeatSelectScreen}
        options={{ title: '좌석 선택' }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{ title: '요약' }}
      />
    </Stack.Navigator>
  );
}
