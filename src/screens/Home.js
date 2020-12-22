import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, SafeAreaView, FlatList, AsyncStorage, Button, TextInput, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
const isAndroid = Platform.OS == "android";
const viewPadding = 10;
import * as WebBrowser from 'expo-web-browser';


export default class NodeList extends Component {


  state = {
    tasks: [ ], 
    text: "", alias:"", user:"", pass:""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };
  changeAliasHandler = alias => {
    this.setState({ alias: alias });
  };
  changeUserHandler = user => {
    this.setState({ user: user });
  };
  changePassHandler = pass => {
    this.setState({ pass: pass });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;


    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text, alias, user, pass } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text, alias: alias, user: user, pass: pass }),
            text: "", alias: "", user: "", pass: ""
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
  };


  


  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(i, 1);

        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewMargin: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewMargin: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewMargin }]}
      >
         <Text style={styles.appTitle}>Nodes</Text>
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCont}>
              <TouchableWithoutFeedback onPress={() => {WebBrowser.openBrowserAsync(`https://${item.user}:${item.pass}@${item.text}`)}}>
                <Text style={styles.listItem}>
                  {item.alias}
                </Text>
                </TouchableWithoutFeedback>
                <Button color= "#ffff" title="&#10006;" onPress={() => this.deleteTask(index)} />
              </View>
              <View style={styles.hr} />
            </View>}
        />
        
        <View style={styles.inputbox}>
         <TextInput
          style={styles.textInput}
          onChangeText={this.changeAliasHandler}
          onSubmitEditing={this.addTask}
          value={this.state.alias}
          placeholder="Alias"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Domain"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeUserHandler}
          onSubmitEditing={this.addTask}
          value={this.state.user}
          placeholder="Username"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changePassHandler}
          onSubmitEditing={this.addTask}
          value={this.state.pass}
          placeholder="password"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        </View>
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task, url: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#485776",
    padding: viewPadding,
    paddingTop: 24
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 4,
    paddingBottom: 2,
    fontSize: 18,
    color:"#ffff"
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    borderColor: "#485776",
    borderWidth: isAndroid ? 2 : 1,
    borderRadius: 5,
    color:"#252525"
  },
appTitle: {
  alignItems:"center",
  justifyContent: "center",
  paddingBottom: 45,
  marginTop: 50,
  fontSize: 25,
  color:"#ffff"
},
inputbox: {
  width: "100%",
  borderRadius: 2,
}

});

AppRegistry.registerComponent("NodeList", () => NOdeList);
