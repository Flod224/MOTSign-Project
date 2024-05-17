import React from 'react'
import {View, Text} from "react-native";
import Routes from './routes/Routes'; 
import {OpenAIApi} from 'openai'
import { REACT_APP_OPENAI_KEY } from '@env';

const App = ()=>{
    const openai = new OpenAIApi({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
    });
    return (<View style= {{flex: 1}} >
        <Routes openai={openai} />
    </View>);
};

export default App;