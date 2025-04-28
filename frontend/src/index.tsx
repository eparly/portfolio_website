import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'react-oidc-context';


const cognitoAuthConfig = {
  authority: "https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_qJ4NNWARf",
  client_id: "6s6b90705i0dlaj36lilric729",
  // redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  // redirect_uri: "http://localhost:3000/recipes",
  // redirect_uri: "https://d13rcjctsw5fza.cloudfront.net",
  redirect_uri: "https://ethanparliament.com/recipes",
  response_type: "code",
  scope: "email openid phone profile",
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
