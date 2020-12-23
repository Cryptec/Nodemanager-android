import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, FlatList, Button, TextInput, Keyboard, Platform } from "react-native";
const isAndroid = Platform.OS == "android";
const viewPadding = 10;
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";


export default class NodeList extends Component {


  state = {
    tasks: [ ], 
    text: "", alias:"", user:"", pass:"",
    show: true,
  }

 
  toggle = () => this.setState(currentState => ({
    show: !currentState.show
  }));

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
            tasks: tasks.concat({ key: tasks.length, alias: alias, text: text, user: user, pass: pass }),
            alias: "", text: "", user: "", pass: ""
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

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
}

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewMargin }]}
      >
         <Text style={styles.appTitle}>My Nodes:</Text>
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          keyExtractor={(item, index) => item.toString()}
          renderItem={ ( {item, index} ) => (
            <View>
              <View style={styles.listItemCont}>
              
                <Text onPress={() => {WebBrowser.openBrowserAsync(`https://${item.user}:${item.pass}@${item.text}`)}} style={styles.listItem}>
                  {item.alias}
                </Text>
               
                <Button color= "#ffff" title="&#10006;" onPress={() => this.deleteTask(index)} />
              </View>
              <View style={styles.hr} />
            </View>
          )}
        />
         
          <TouchableOpacity onClick={this.toggle}><View style={styles.button}><Text style={styles.arrow}>&#8593;</Text></View></TouchableOpacity>
        {this.state.show && 
        <View style={styles.inputbox}>
        
          <Text style={{color:"white", marginLeft: 5}}>Add Node:</Text> 
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
          placeholder="Dashboard-user"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changePassHandler}
          onSubmitEditing={this.addTask}
          value={this.state.pass}
          placeholder="Dashboard-password"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        </View>
      }
      </View>
          
    )
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task, user: task, pass: task, alias: task, url: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.alias).join("||")
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
    paddingLeft: 10,
    fontSize: 18,
    color: "#485776"
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 0,
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 3,
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    borderColor: "#485776",
    borderWidth: isAndroid ? 2 : 1,
    borderRadius: 5,
    color: "#252525"
  },
  appTitle: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 45,
    marginTop: 50,
    fontSize: 25,
    color: "#ffff"
  },
  inputbox: {
    width: "100%",
    borderRadius: 2,
    display: "flex",
  },
  button: {
    backgroundColor: "#485776",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    color: "white",
  }

});

AppRegistry.registerComponent("NodeList", () => NodeList);
