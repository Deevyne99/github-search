import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { GithubProvider } from './context/context'
import { Auth0Provider } from '@auth0/auth0-react'
// dev - jsxvk66zheufr8es.us.auth0.com
// YNT8z9ZoPfo3BwsAF1nSqoB2NFBQ3npJ

//dev-jsxvk66zheufr8es.us.auth0.com
//sxWCUJ1xlcJ5LLCma2XOb6VS7TtHfOkp
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-jsxvk66zheufr8es.us.auth0.com'
      clientId='YNT8z9ZoPfo3BwsAF1nSqoB2NFBQ3npJ'
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
