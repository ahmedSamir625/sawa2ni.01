import React, { useState, createContext } from 'react'

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [user, setUser] = useState({
  

        _id: '',
        // username: '',
        email: '',
        firstName: '',
        LastName: '',
        // birthdate: new Date(),
        // gender: '',
        phone: '',
        // profilePicture: '',
        cart: [],
    })

    return (
        <UserContext.Provider value={[user, setUser]}  >
            {props.children}
        </UserContext.Provider>
    )
}

