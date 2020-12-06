import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './shared/store/store/index'
import { Provider } from "react-redux";
import { StripeProvider } from 'react-stripe-elements'


//ReactDOM.render(<App />, document.getElementById('root'));

async function init() {
  const store = await configureStore();
  ReactDOM.render(
    <StripeProvider apiKey="pk_test_VeAKNWYz4KGCeVebMYwKS5Zm00tCM3N3Wu">
      <Provider store={store}>
        <App />
      </Provider>
    </StripeProvider>
    ,
    document.getElementById('root')
  );
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
