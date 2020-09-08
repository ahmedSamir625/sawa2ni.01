import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../Providers/UserContext'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SentimentDissatisfiedOutlinedIcon from '@material-ui/icons/SentimentDissatisfiedOutlined';
import Rating from '@material-ui/lab/Rating';
import {server} from '../../Constants'


import './UserProductCard.css'

export default function ProductCard({ product, inCart }) {

    const [user, setUser] = useContext(UserContext)
    const [addedToCart, setAddedToCart] = useState(false)


    const addToCart = (userId, productId) => {
        fetch(`${server}addToCart`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    setAddedToCart(true)

                    let userCart = [...user.cart]
                    userCart.push({
                        productId: productId,
                        amount: 1
                    })

                    setUser({ ...user, cart: userCart })

                }
                else {
                    alert('cannot be added');
                }
            })
            .catch(() => alert('cannot be added'))
    }

    return (
        <Card className="root" style={{ boxShadow: '2px 2px 7px 0px #bbb' }}>

            <Link to={`/ProductDetails/${product._id}`} style={{ textDecoration: "none " }}>


                <CardMedia style={{ marginBottom: 10, height: '300px' }}
                    className="media"
                    image={product.images[0]}
                />

                <label style={{ fontWeight: '500', color: "#ff5500", fontSize: '19px' }}>{product.name}</label><br />
                <label style={{ fontWeight: '600', color: "#00aa46", fontSize: '16px' }}>{`${product.price}$`}</label>


                <CardContent style={{ paddingTop: "5px", paddingBottom: "0px" }}>
                    <Rating
                        name="half-rating"
                        size="medium"
                        value={parseFloat(product.overallRate)}
                        precision={0.1}
                        readOnly
                    />

                </CardContent>
            </Link>

            <CardActions disableSpacing style={{ paddingBottom: 0, paddingTop: 0 }}>
                {
                    product.amount > 0 ? (
                        inCart
                            ? <button className="add-btn"
                                style={{ backgroundColor: '#5A5a', pointerEvents: 'none' }}>
                                {'ADDED TO CART'}
                                <CheckCircleOutlineIcon style={{ marginLeft: "10px" }} />
                            </button>

                            : addedToCart
                                ? <button className="add-btn"
                                    style={{ backgroundColor: '#5A5A', pointerEvents: 'none' }}  >
                                    {'ADDED TO CART'}
                                    <CheckCircleOutlineIcon style={{ marginLeft: "10px" }} />
                                </button>
                                : <button
                                    className="add-btn"

                                    onClick={addToCart.bind(this, user._id, product._id)}
                                >{'ADD TO CART'}< AddShoppingCartIcon style={{ marginLeft: "10px" }} />

                                </button>
                    ) :
                        <button className="add-btn"
                            style={{ backgroundColor: '#ccc', pointerEvents: 'none'  , fontSize:'14px'}}>
                            {'Currently not Available'}
                            <SentimentDissatisfiedOutlinedIcon style={{ marginLeft: "10px" }} />
                        </button>

                }

            </CardActions>

        </Card>

    );
}
