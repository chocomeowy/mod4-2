import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import firebase from "../database/firebaseDB"
import { Ionicons } from "@expo/vector-icons";

const db = firebase.firestore().collection("todos");

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

//load up Firebase database on start. 
// The snapshot keeps everything synced -- no need to refresh it later!
useEffect(() => {
  const unsubscribe = 
  db.orderBy("created").onSnapshot((collection) => {  // let's get back a snapshot of this collection
    const updatedNotes = collection.docs.map((doc) => {
      //create our own object that pulls the ID into a property
      const noteObject ={
        ...doc.data(),
        id: doc.id,
      };
      console.log(noteObject);
      return noteObject;
    });
    setNotes(updatedNotes); // and set our notes state array to its docs
  });
  
  //unsubscribing when unmounting
  return () => { 
    unsubscribe();
  };
}, []);

//this deletes an individual note
function deleteNote(id) {
  console.log("deleting " + id);

  db.where("id", "==", id)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => doc.ref.delete());
  });
}

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#E86252",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  // Monitor route.params for changes and add items to the database
  useEffect(() => {
    if (route.params?.text) {
      const newNote = {
        title: route.params.text,
        done: false,
        created: firebase.firestore.FieldValue.serverTimestamp(),

      };
      db.add(newNote);

    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Screen");
  }

  
  // This deletes an individual note
  function deleteNote(id) {
    console.log("Deleting " + id);
    db.doc(id).delete();
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#E87EA1",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Ionicons name="trash" size={16} color="#E86252" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEBD0",
    alignItems: "center",
    justifyContent: "center",
  },
});
