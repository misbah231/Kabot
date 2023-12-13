import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

const BOT = {
  _id: 2,
  name: 'Kabot',
  avatar: require('./assets/images/kimo.jpg'),
};

class App extends Component {
  state = {
    messages: [
      {
        _id: 3,
        text: 'What can I help you?',
        createdAt: new Date(),
        user: BOT,
      },
      {
        _id: 2,
        text: 'My name is Kabot',
        createdAt: new Date(),
        user: BOT,
      },
      {
        _id: 1,
        text: 'Hi!',
        createdAt: new Date(),
        user: BOT,
      },
    ],
    id: 1,
    name: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentText;
    this.sendBotResponse(text);
  }  

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT,
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  onQuickReply(quickReplies) {
    let message = quickReplies[0].value;

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, quickReplies),
    }));

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#e9e9e9' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onQuickReply={quickReplies => this.onQuickReply(quickReplies)}
          user={{ _id: 1 }}
        />
      </View>
    );
  }
}

export default App;
