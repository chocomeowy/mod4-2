import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotesScreen from "./NotesScreen";

const InnerStack = createStackNavigator();
export default function NotesStack() {
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          title: "Notes App",
          headerStyle: {
            backgroundColor: "#EBB3A9",
            height: 100,
            shadowColor: "black",
            shadowOpacity: 0.2,
            shadowRadius: 5,
          },
          headerTintColor: "#EE2677",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
        }}
      />
    </InnerStack.Navigator>
  );
}
