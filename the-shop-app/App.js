import React, { useState } from 'react';
//import { createStackNavigator } from 'react-navigation-stack'; npm install --save react-navigation-tabs, import { createTabsNavigator } from 'react-navigation-tabs'; npm install --save react-navigation-drawer, import { createDrawerNavigator } from 'react-navigation-drawer'; 
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import productReducer from './store/reducer/product';
import cartReducer from './store/reducer/cart';
import ordersReducer from './store/reducer/order';
import authReducer from './store/reducer/auth';
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading startAsync={fetchFonts} onFinish={() => { setFontLoaded(true)}} />
  );
}
  return (
    <Provider store={store}>
        <NavigationContainer />
    </Provider>
  );
}


