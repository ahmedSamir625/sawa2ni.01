import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../Providers/UserContext'
import MyCartCard from '../../Components/MyCartCard/MyCartCard'
import { Link } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import {server} from '../../Constants';

import './MyCart.css'


const MyCart = () => {
    const [user, setUser] = useContext(UserContext)
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        let cartProductsIds = []

        user.cart && user.cart.forEach(item => {
            cartProductsIds.push(item.productId)
        });

        fetch(`${server}myCart`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cartProductsIds })
        })
            .then(response => response.json())
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch(() => {
                alert('Something went wrong!')
                // setLoading(false)
            })

    }, [user])


    useEffect(() => {

        calcTotal()

    }, [user, products])


    const calcTotal = () => {
        if (products.length !== 0) {
            let tot = 0
            user.cart.forEach(product => {
                let price = products.find(p => p._id === product.productId).price
                tot += price * product.amount
            });
            setTotal(tot)
        }

        else {
            setTotal(0)
        }

    }

    const removeFromCart = (index) => {


        fetch(`${server}removeFromCart`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, productId: products[index]._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.nModified) {
                    let userCart = [...user.cart]
                    let itemIndex = userCart.findIndex(p => p.productId === products[index]._id)
                    userCart.splice(itemIndex, 1)

                    let _products = [...products]
                    _products.splice(index, 1)



                    setUser({ ...user, cart: userCart })
                    setProducts(_products)

                    calcTotal()
                }
            })
            .catch(() => {
                alert('Cannot Remove !, try again later.')
            })
    }

    return (

        <div>
            <div className='action-bar'>
                <label >{`Total Pay ${total.toFixed(2)} £`}</label>
                {
                    products.length ?
                        <Link to={`/OrderForm`} style={{ textDecoration: "none " }}>
                            <button className="order-btn">Checkout</button>
                        </Link>
                        : <button disabled className="order-btn" style={{ borderColor: '#ccc', color: '#ccc' }}>Checkout</button>

                }
            </div>
            {
                loading
                    ? <div className="center-pos" style={{ minHeight: '50vh' }}>
                        <CircularProgress  disableShrink style={{ color: '#ddd', margin: '20px' }} />
                        <label
                            style={{ fontSize: '25px', fontWeight: '700', color: '#ddd', letterSpacing: '2px' }}
                        >Loading Cart Items</label>
                    </div>
                    : (
                        products.length
                            ? <div className='cards-position'     >

                                {
                                    products.map((product, index) => (
                                        <MyCartCard
                                            key={product._id}
                                            product={product}
                                            remove={removeFromCart.bind(this, index)}
                                        />
                                    ))
                                }

                            </div>
                            : <div className="center-pos" style={{ minHeight: '70vh' }}>
                                <img style={{ marginBottom: '20px', width: '250px', height: 'auto' }}
                                    src="https://www.babymumz.com/resources/assets/front/img/cartEmpty.png" />
                                <h2 style={{ color: '#ccc' }}>Your Cart is Empty !</h2>

                            </div>
                    )

            }
        </div>

    )
}

export default MyCart
