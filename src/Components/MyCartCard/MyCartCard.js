import React, { useContext} from 'react'
import './MyCartCard.css'

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import { UserContext } from '../../Providers/UserContext'
import {server} from '../../Constants'


const MyCartCard = ({ product, remove }) => {
    const [user, setUser] = useContext(UserContext)


    const increment = () => {
        if (user.cart.find(p => p.productId === product._id).amount < product.amount) {
            let userCart = [...user.cart]
            let index = userCart.findIndex(p => p.productId === product._id)
            userCart[index].amount += 1

            setUser({ ...user, cart: userCart })

            fetch(`${server}incrementAmount`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, productId: product._id })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null) {
                        let userCart = [...user.cart]
                        let index = userCart.findIndex(p => p.productId === product._id)
                        userCart[index].amount -= 1

                        alert('Cannot Increment !, try again later.')
                    }
                })
                .catch(() => {
                    let userCart = [...user.cart]
                    let index = userCart.findIndex(p => p.productId === product._id)
                    userCart[index].amount -= 1

                    alert('Cannot Increment !, try again later.')
                })

        }
        else {
            alert('You Reached the Maximum Amount In Stock !')
        }
    }

    const decrement = () => {
        if (user.cart.find(p => p.productId === product._id).amount > 1) {
            let userCart = [...user.cart]
            let index = userCart.findIndex(p => p.productId === product._id)
            userCart[index].amount -= 1

            setUser({ ...user, cart: userCart })

            fetch(`${server}decrementAmount`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, productId: product._id })
            })
                .then(response => response.json())
                .then(data => {
                    if (data == null) {
                        let userCart = [...user.cart]
                        let index = userCart.findIndex(p => p.productId === product._id)
                        userCart[index].amount += 1

                        alert('Cannot Decrement !, try again later.')
                    }
                })
                .catch(() => {
                    let userCart = [...user.cart]
                    let index = userCart.findIndex(p => p.productId === product._id)
                    userCart[index].amount += 1

                    alert('Cannot Decrement !, try again later.')
                })

        }
        else {
            alert('You Reached the Minimum Amount !')
        }

    }



    return (
        <div className="my-cart-card">

            <div className="hr">
                <img style={{ borderRadius: "10px" }} width="150" height="150"
                    src={product.images[0]} alt="" ></img>
                <div className="card-data">
                    <label
                        style={{
                            textAlign: "left",
                            wordBreak: "break-word",
                            marginTop: "25px",
                            marginBottom: "5px",
                            fontSize: "22px",
                            fontWeight: "500"
                        }}>
                        {product.name}</label>
                    <label style={{ color: "#888", fontSize: "18px" }}>{`${product.price} £`}</label>
                </div>

            </div>
            <hr style={{ margin: "10px 0px 5px 0px", borderStyle: "solid", borderColor: "#eee" }} />
            <div className="action-div">
                <div style={{ width: "25%", textAlign: "left", paddingRight: "10px" }}>

                    <div className="icon-btn" onClick={remove}>
                        <DeleteOutlineIcon style={{ color: '#aaa' }} />
                    </div>
                </div>

                <div className="hr" style={{ justifyContent: "center", width: "50%", alignItems: "center", alignContent: "center" }}>

                    <div className="icon-btn" onClick={increment} >
                        <AddCircleOutlineIcon style={{ color: '#fd720f' }} />
                    </div>

                    <label style={{ fontSize: "18px", fontWeight: "600", color: "#777" }}>
                        {user.cart.find(p => p.productId === product._id) ? user.cart.find(p => p.productId === product._id).amount : '0'}
                    </label>

                    <div className="icon-btn" onClick={decrement} >
                        <RemoveCircleOutlineIcon style={{ color: '#fd720f' }} />
                    </div>

                </div>
                <div className="vertical-line" ></div>


                <label style={{
                    paddingLeft: "10px",
                    width: "25%",
                    wordBreak: "break-word",
                    textAlign: "center",
                    color: '#fd720f'
                }}>
                    {`${(user.cart.find(p => p.productId === product._id)
                        ? user.cart.find(p => p.productId === product._id).amount * product.price : 0).toFixed(2)} £`}
                </label>
            </div>

        </div>
    )
}

export default MyCartCard
