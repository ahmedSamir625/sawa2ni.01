import React, { useState, useContext, useEffect } from 'react'
import './OrderDetailsForm.css'
import '../AddProduct/AddProduct.css'
import { cities } from './Cities'
import {server} from '../../Constants';

import { UserContext } from '../../Providers/UserContext'


const OrderDetailsForm = () => {


    const [user,] = useContext(UserContext)
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [shipmentPrice,] = useState(35)

    const [order, setOrder] = useState({
        user: {
            id: '',
            name: {
                firstName: '',
                lastName: '',
            },
            phoneNumber: {
                code: '+20',
                number: '',

            },
            addressInfo: {
                address: '',
                city: cities[Object.keys(cities)[0]][0],
                province: Object.keys(cities)[0],
            }
        },



    })

    const updateFirstName = (event) => {
        let user = order.user
        user.name.firstName = event.target.value
        setOrder({ ...order, user: user })
    }
    const updateLastName = (event) => {

        let user = order.user
        user.name.lastName = event.target.value
        setOrder({ ...order, user: user })
    }

    const updatePhoneNumber = (event) => {
        let user = order.user
        user.phoneNumber.number = event.target.value
        setOrder({ ...order, user: user })
    }

    const updateInitailAddress = (event) => {
        let user = order.user
        user.addressInfo.address = event.target.value
        setOrder({ ...order, user: user })
    }

    const updateAddressProvince = (event) => {
        let user = order.user
        user.addressInfo.province = event.target.value
        user.addressInfo.city = cities[event.target.value][0]
        setOrder({ ...order, user: user })
    }

    const updateAddressCity = (event) => {
        let user = order.user
        user.addressInfo.city = event.target.value
        setOrder({ ...order, user: user })
    }

    useEffect(() => {

        let cartProductsIds = []

        user.cart.forEach(item => {
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
            })
            .catch(() => alert('Something Went Wrong !'))

    }, [user])


    useEffect(() => {

        if (products.length !== 0) {
            let tot = 0
            user.cart.forEach(product => {
                let price = products.find(p => p._id === product.productId).price
                tot += price * product.amount
            });
            setTotal(tot)
        }
    }, [user, products])

    const submitOrder = (event) => {

        event.preventDefault();

        const date = new Date()

        let _user = order.user
        _user.id = user._id
        setOrder({ ...order, user: _user })

        let _cartItems = [...user.cart]

        _cartItems.forEach(item => {
            const _product = products.find(product => product._id === item.productId)
            item['price'] = _product.price
            item['name'] = _product.name
            item['image'] = _product.images[0]


        });



        const _order = {
            user: order.user,
            date: date,
            paymentMethod: document.getElementById("cash").checked ? "cash" : "visa",
            items: _cartItems,
            totalPayment: total,
            shipmentPrice: 35,
            state: 
            {
                inProcessing: null,
                shipped: null,
                delivered: null,

            }
        }

        fetch(`${server}addOrder`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_order)
        })
            .then(response => response.json())
            .then(data => {
                if (!data._id) {
                    alert('Cannot be added')
                }
                else {
                    window.location.href = "/Orders"
                }
            })
            .catch(() => alert('Cannot connect to server try again later'))

    }




    return (

        <div className="display-style" >
            <form className="form-style" onSubmit={submitOrder}>
                <div className="back-container">
                    <div>
                        <label style={{ color: '#999', fontSize: '18px', fontWeight: "300px" }}> 1. Address Details</label>
                        <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '20px' }} />
                    </div>
                    <div className="name-box">

                        <div style={{ width: '30%' }}>
                            <label htmlFor="fname" style={{ paddingLeft: "5px" }} > First Name *</label>
                            <input id="user-fname" type="text" name="name" required placeholder="Enter a Name for the order" className="input-style"
                                style={{ minWidth: "50px" }}
                                onChange={updateFirstName}
                            />

                        </div>
                        <div style={{ width: '70%', marginLeft: '10px' }}>
                            <label htmlFor="lname" style={{ paddingLeft: "5px" }} > Last Name *</label>
                            <input id="user-lname" type="text" name="name" required placeholder="Enter a Name for the order" className="input-style"
                                onChange={updateLastName}
                            />
                        </div>

                    </div>


                    <label htmlFor="phone-number" style={{ paddingLeft: "5px" }}> Phone Number *</label>
                    <div className="name-box">

                        <input type="text" readOnly value="+20"
                            className="input-style"
                            style={{ width: '7%', minWidth: '50px' }}
                        />
                        <input id="phone-number" type="text" name="phone" required placeholder="Enter Your Phone Number"
                            minLength="10" maxLength="10"
                            className="input-style"
                            style={{ width: '93%', marginLeft: '10px' }}
                            onChange={updatePhoneNumber}
                        />
                    </div>

                    <label style={{ paddingLeft: "5px" }}> St.Name/Building/Apartment number/ Area *</label>
                    <textarea

                        id="address"
                        rows='1'
                        wrap='on'
                        autoCapitalize='on'
                        type="text" name="address" className="input-style" style={{ height: '100px' }}
                        placeholder="St.Name/Building/Apartment number/ Area"
                        required
                        onChange={updateInitailAddress}
                    />


                    <label style={{ paddingLeft: "5px" }}> Province *</label>

                    <select className="input-style" name="provices" id="provices" style={{ paddingRight: '100px' }}
                        onChange={updateAddressProvince}
                    >
                        {
                            Object.keys(cities).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))
                        }

                    </select>

                    <label style={{ paddingLeft: "5px" }}> City *</label>

                    <select className="input-style" name="cities" id="cities"
                        onChange={updateAddressCity}
                    >
                        {
                            cities[order.user.addressInfo.province].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))
                        }

                    </select>

                </div>

                <div className="back-container">
                    <div>
                        <label style={{ color: '#999', fontSize: '18px', fontWeight: "300px" }}> 2. Payment Options</label>
                        <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '15px' }} />
                    </div>

                    <input id="cash" type="radio" name="pay-method" className='check-box' value="Cash" defaultChecked />
                    <label style={{ marginLeft: '10px', color: '#555' }}>Cash</label> <br />

                    <input disabled id="visa" type="radio" name="pay-method" className='check-box' value="Visa" />
                    <label style={{ marginLeft: '10px', color: '#aaa' }}>Visa (this option is currently not available)</label> <br />

                </div>
                <button className="submit-btn" >Submit Order</button>
            </form>


            <div className="order-summary">
                <label style={{ alignContent: 'left', color: '#999', fontSize: '18px', fontWeight: "300px" }}>
                    {`Order Summary (${products.length} Item${products.length === 1 ? '' : 's'})`}
                </label>
                <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />


                {
                    <div style={{ maxHeight: "365px", overflow: "scroll" }}>
                        {products.map(product => (
                            <div key={product._id} >
                                <div className="summary-item">
                                    <img src={product.images[0]}
                                        alt="item" className="summary-item-image" />

                                    <div className="summary-item-info">
                                        <label style={{ marginLeft: '10px', }}>{product.name}</label>
                                        <label style={{ marginLeft: '10px', color: "#494" }}>{`${product.price} £`}</label>
                                        <label style={{ marginLeft: '10px', color: "#777" }}>
                                            {`Qty: ${user.cart.find(p => p.productId === product._id).amount}`}
                                        </label>
                                        <label style={{ marginLeft: '10px', color: "#777" }}>
                                            {`Item Total ${(user.cart.find(p => p.productId === product._id).amount * product.price).toFixed(2)} £`}

                                        </label>
                                    </div>
                                </div>
                                <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '5px', marginTop: "5px" }} />
                            </div>
                        ))}
                    </div>

                }



                <div className="split">
                    <label style={{ color: "#999" }}>{`Sub Total`}</label>
                    <label style={{ color: "#f99" }}>{`${total.toFixed(2)} £`}</label>
                </div>

                <div className="split">
                    <label style={{ color: "#999" }}>{`Shipment`}</label>
                    <label style={{ color: "#f99" }}>{`${shipmentPrice} £`}</label>
                </div>
                <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />

                <div className="split">
                    <label style={{ color: "#555", fontWeight: "600" }}>{`Total`}</label>
                    <label style={{ color: "#f77", fontWeight: "600" }}>{`${(total + shipmentPrice).toFixed(2)} £`}</label>
                </div>
                {/* <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />


                <div style={{ textAlign: "center" }}>
                    <label style={{ color: '#f99', fontSize: '16px' }}> {`Edit Cart`} </label>
                </div> */}



            </div>

        </div>

    )
}

export default OrderDetailsForm
