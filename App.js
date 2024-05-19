import React from 'react'
import {View, Text} from "react-native";
import Routes from './routes/Routes'; 
import { REACT_APP_OPENAI_KEY } from '@env';

const App = ()=>{
   console.log(REACT_APP_OPENAI_KEY)
    return (<View style= {{flex: 1}} >
        <Routes> </Routes>
    </View>);
};

export default App;