import React, {  useState, useEffect } from 'react';
import './App.css';
import AuthForm from './Containers/AuthenticationForm/AuthForm';
import Cookies from 'js-cookie'
import CircularProgress from '@material-ui/core/CircularProgress';
import {server} from './Constants'

import MiniDrawer from './Components/Drawer/Drawer'
import { UserProvider } from './Providers/UserContext'
// import {server} from './Constants'

function App() {

  const [user, setUser] = useState('')

  useEffect(() => {

    const loggedUserCookies = Cookies.getJSON('loggedUser');
    if (loggedUserCookies) {

      fetch(`${server}getUser`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: loggedUserCookies.userid })
      })
        .then(response => response.json())
        .then(_user => {
          setUser(_user)
        })
        .catch(err => { console.log(err) })
    }

  }, [])


  const getUser = (loggedUser) => {
    setUser(loggedUser)
  }



  return (
    <div className="App">

      <UserProvider>
        {
          Cookies.getJSON('loggedUser')
            ? (
              user._id
                ? <MiniDrawer loggedUser={user} />
                : <div className="center-pos">
                  <CircularProgress  disableShrink style={{ color: '#ddd', margin: '20px' }} />
                  <label
                    style={{ fontSize: '30px', fontWeight: '700', color: '#ddd', letterSpacing: '2px' }}
                  >SAWA2NI</label>
                </div>
            )
            : <AuthForm getUser={getUser} />
        }
      </UserProvider>
    </div>
  );
}

export default App;
