import React, { useState, useContext } from 'react'
import './AuthenticationForm.css'
import Cookies from 'js-cookie'
import { UserContext } from '../../Providers/UserContext'
import {server} from '../../Constants';


const AuthForm = ({ getUser }) => {

    const [action, setAction] = useState('SIGNIN')
    const [toggle, setToggle] = useState('Register')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [, setUser] = useContext(UserContext)

    const [name, setName] = useState({
        firstName: '',
        lastName: ''
    })

    const [phone, setPhone] = useState({
        code: '+20',
        number: ''
    })


    const toggleAction = () => {
        // action === 'SIGNIN'
        //     ? .setState({ action: 'REGISTER', toggle: 'Signin' })
        //     : .setState({ action: 'SIGNIN', toggle: 'Register' })

        if (action === 'SIGNIN') {
            setAction('REGISTER')
            setToggle('Signin')
        }
        else {
            setAction('SIGNIN')
            setToggle('Register')
        }
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const onPasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const onFirstNameChange = (event) => {
        setName({ ...name, firstName: event.target.value })
    }

    const onLastNameChange = (event) => {
        setName({ ...name, lastName: event.target.value })
    }

    const onPhoneChange = (event) => {
        setPhone({ ...phone, number: event.target.value })
    }

    const onConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value)
    }


    const setCookies = (user) => {
        Cookies.set('loggedUser', {
            userid: user._id,
            email: user.email,
        })
    }


    const onActionSignin = (event) => {
        event.preventDefault()

        fetch(`${server}signin`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
            })
        })
            .then(response => response.json())
            .then(_user => {

                if (_user._id) {
                    setCookies(_user);
                    setUser(_user)
                    getUser(_user)
                }
                else {
                    alert('Wrong Email or Password');
                }
            })
            .catch(() => alert('Something went Wrong!'))
    }

    const onActionRegister = (event) => {


        event.preventDefault()

        if (password === confirmPassword) {

            fetch(`${server}register`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        name,
                        email,
                        phone,
                        password,
                    }
                )
            })
                .then(response => response.json())
                .then(_user => {
                    if (_user._id) {
                        setCookies(_user);

                        setUser(_user)
                        getUser(_user)
                    }

                    else {
                        alert('Wrong Email or Password')
                    }

                })
                .catch(() =>
                    alert('something went wrong')
                )
        }

        else {
            alert('password is not the same')
            setConfirmPassword('')
            setPassword('')
        }

    }

    return (
        <div className="background hr-display" >
            <form className="form-box  align-form-items"
                onSubmit={action === 'SIGNIN' ? onActionSignin : onActionRegister}>
                <br />
                <label className="title">SAWA2NI</label>

                {
                    action === 'REGISTER' &&
                    <div>
                        <label style={{ color: '#522424' }}>First Name</label>
                        <input onChange={onFirstNameChange}
                            type="text" id="first-name" name="name"
                            className="input" required />

                        <label style={{ color: '#522424' }}>Last Name</label>
                        <input onChange={onLastNameChange}
                            type="text" id="last-name" name="name" className="input" required />
                    </div>
                }

                <label style={{ color: '#522424' }}>Email</label>
                <input onChange={onEmailChange} type="email" id="email" className="input" required />

                {
                    action === 'REGISTER' &&
                    <div>
                        <label style={{ color: '#522424' }}>Phone Number</label>
                        <div className='hr-display'  >
                            <input style={{ width: '15%', marginRight: '5px' }}
                                type="text" id="phone-code" name="phone" className="input"
                                readOnly value='+20'
                            />
                            <input onChange={onPhoneChange} style={{ width: '85%' }}
                                type="text" id="phone-number" name="phone" className="input" required />
                        </div>
                    </div>

                }
                <label style={{ color: '#522424' }}>Password</label>
                <input
                    onChange={onPasswordChange}
                    value={password}
                    minLength='8'
                    type="password" className="input"
                    style={{ fontSize: '20px' }} required />


                {
                    action === 'REGISTER' &&
                    <div>
                        <label style={{ color: '#522424' }}>Re-enter Password</label>
                        <input
                            onChange={onConfirmPasswordChange}
                            value={confirmPassword}
                            minLength='8'
                            type="password" className="input" style={{ fontSize: '20px' }} required />
                    </div>
                }

                <button
                    className="button"
                    type="submit"
                >{action}</button>

                <label className="toggle-btn" onClick={toggleAction} >{toggle}</label>
                <br />
            </form>
        </div>
    )
}

export default AuthForm
