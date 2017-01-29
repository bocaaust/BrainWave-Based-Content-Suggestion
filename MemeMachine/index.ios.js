/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import Clarifai from 'clarifai';

import cylon from 'cylon';


var app = new Clarifai.App(
  'g1kmENvdBydTtZNh4F1jI4KFA2qx3fYGzyeb2FV6',
  'p2ZFeZG778rmurb4DYF-OsgjD8IvbQVUuBCsA2Lw'
);

var options = {
  title: 'Select an Image',
  storageOptions: {
    skipBackup: true,
  },
  maxWidth: 480
};

export default class MemeMachine extends Component {
   
    selectImage(){
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else {
      // Do something with the selected image
        this.setState({imageSource: response.uri.replace('file://', '')});
        app.models.predict(Clarifai.GENERAL_MODEL, {base64:response.data}).then(
(res) => {
  console.log('Clarifai response = ', res);
  let tags = '';
  for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
    tags += res.data.outputs[0].data.concepts[i].name + ' ';
  }
  this.setState({tagText:tags});
},
(error)=>{
  console.log(error);  
});
    }
  });
}
    constructor() {
  super();
 this.state = {imageSource:'https://community.clarifai.com/uploads/default/_emoji/clarifai.png', tagText: ''};
}
  render() {
    return (
      <View style={styles.container}>
  <TouchableHighlight onPress={this.selectImage.bind(this)}>
    <Text>Select an image</Text>
  </TouchableHighlight>
    <Image
    source={{uri: this.state.imageSource}}
    style={styles.image}
  />
    <Text>{this.state.tagText}</Text>
</View>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 200,
    height:200 
  }
});

AppRegistry.registerComponent('MemeMachine', () => MemeMachine);
