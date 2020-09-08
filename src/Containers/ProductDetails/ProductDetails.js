import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './ProductDetails.css'

import SlideShow from '../../Components/SlideShow/SlideShow';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Rating from '@material-ui/lab/Rating';
import CircularProgress from '@material-ui/core/CircularProgress';
import {server} from '../../Constants'
import { UserContext } from '../../Providers/UserContext'
var dateFormat = require('dateformat');


const ProductDetails = ({ match }) => {

    const [user, setUser] = useContext(UserContext)
    const [product, setProduct] = useState()
    const [addedToCart, setAddedToCart] = useState(false)
    const [value, setValue] = React.useState(null);
    const [allRatesInfo, setAllRatesInfo] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        fetch(`${server}getProduct`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: match.params.id })
        })
            .then(response => response.json())
            .then(_product => {
                setProduct(_product)

                const rev = _product.reviews.find(rev => rev.userId === user._id)
                if (rev) {
                    setValue(rev.rate)
                }
                setLoading(false)

            })
            .catch(() => alert('something went wrong !'))

    }, [user])


    useEffect(() => {
        if (product) {
            let oneStarCounter = 0
            let twoStarsCounter = 0
            let threeStarsCounter = 0
            let fourStarsCounter = 0
            let fiveStarsCounter = 0
            let total = 0

            product.reviews.forEach(rev => {
                total += rev.rate


                switch (rev.rate) {
                    case 1:
                        oneStarCounter++
                        break;
                    case 2:
                        twoStarsCounter++
                        break;
                    case 3:
                        threeStarsCounter++
                        break;
                    case 4:
                        fourStarsCounter++
                        break;
                    case 5:
                        fiveStarsCounter++
                        break;
                }
            });

            const _numOfRates = product.reviews.length


            const ratesInfo = {
                oneStar: {
                    ctr: oneStarCounter,
                    pct: (((oneStarCounter / _numOfRates) * 100).toString()).concat('%'),
                },
                twoStars: {
                    ctr: twoStarsCounter,
                    pct: (((twoStarsCounter / _numOfRates) * 100).toString()).concat('%'),
                },
                threeStars: {
                    ctr: threeStarsCounter,
                    pct: (((threeStarsCounter / _numOfRates) * 100).toString()).concat('%'),
                },
                fourStars: {
                    ctr: fourStarsCounter,
                    pct: (((fourStarsCounter / _numOfRates) * 100).toString()).concat('%'),
                },
                fiveStars: {
                    ctr: fiveStarsCounter,
                    pct: (((fiveStarsCounter / _numOfRates) * 100).toString()).concat('%'),
                },
                rateRatio: _numOfRates ? (total / _numOfRates).toFixed(1) : 0.0,
                numberOfRates: _numOfRates,
            }

            setAllRatesInfo(ratesInfo)

        }

    }, [product])



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
                    alert('cannot be inserted')
                }
            })
            .catch(() => alert('cannot be inserted'))
    }



    const addRate = (productId, userId, rate, oldRate) => {


        if (rate) {
            setValue(rate)


            if (value) {
                const newOverall = ((product.overallRate * allRatesInfo.numberOfRates) - oldRate + rate) / allRatesInfo.numberOfRates

                fetch(`${server}updateRate`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: productId, userId: userId, rate: rate, overallRate: newOverall.toFixed(1) })
                })
                    .then(response => response.json())
                    .then(res => {
                        !res.nModified && setValue(oldRate)

                        const revIndex = product.reviews.findIndex(rev => rev.userId === userId);
                        const _revs = [...product.reviews]
                        _revs[revIndex].rate = rate


                        setProduct({ ...product, overallRate: newOverall.toFixed(1), reviews: _revs })

                    })
                    .catch(err => setValue(oldRate))
            }
            else {

                const newOverall = ((product.overallRate * allRatesInfo.numberOfRates) + rate) / (allRatesInfo.numberOfRates + 1)
                const revRateInfo = {
                    userId: user._id,
                    rate: rate
                }

                fetch(`${server}addRate`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, revRateInfo, overallRate: newOverall.toFixed(1) })
                })
                    .then(response => response.json())
                    .then(res => {
                        !res.nModified && setValue(oldRate)

                        let revs = [...product.reviews]
                        revs.push(revRateInfo)

                        setProduct({ ...product, overallRate: newOverall.toFixed(1), reviews: revs })

                    })
                    .catch(() => {
                        setValue(oldRate)
                        alert('something went wrong')
                    })
            }
        }
    }


    return (
        product ? <div >
            <SlideShow urls={product.images} />

            <div className="info-pos">
                <div className="main-info-pos" style={{ width: "100%" }}>
                    <div className="info-pos" style={{ margin: "0px", width: "60%" }}>
                        <h2 className="name">{product.name}</h2>

                        {
                            product.amount > 0
                                ? <label>{`Available Amount ${product.amount}`}</label>
                                : <label style={{ fontSize: '18px', color: '#a00' }}>
                                    Sorry, This Product Currently not Available !</label>

                        }
                        <label
                            className="price">{`${product.price} $`}</label>
                    </div>

                    {

                        user._id && !user.admin && product.amount > 0 && (user.cart.find(item => item.productId === product._id)
                            ? <button className="add-to-cart-btn"
                                style={{ backgroundColor: '#5A5a', pointerEvents: 'none' }}>
                                {'ADDED TO CART'}
                                <CheckCircleOutlineIcon style={{ marginLeft: "10px" }} />
                            </button>
                            : addedToCart
                                ? <button className="add-to-cart-btn"
                                    style={{ backgroundColor: '#5A5A', pointerEvents: 'none' }}  >
                                    {'ADDED TO CART'}
                                    <CheckCircleOutlineIcon style={{ marginLeft: "10px" }} />
                                </button>
                                : <button
                                    className="add-to-cart-btn"

                                    onClick={addToCart.bind(this, user._id, product._id)}
                                >{'ADD TO CART'}< AddShoppingCartIcon style={{ marginLeft: "10px" }} />

                                </button>)

                    }


                </div>

                <label className="headline">Details</label>
                <div className="display-box" >{product.details}</div>

                <label className="headline">Customer Reviews</label>

                <div className="display-box" >
                    <div className="hr-display"
                        style={{ minWidth: '500px', justifyContent: 'space-evenly', alignItems: 'center', padding: '50px', minWidth: '500px' }} >

                        <div className="vr-display">
                            <div className='rate-circle'>
                                {/* {allRatesInfo.rateRatio} */}
                                {product.overallRate}
                            </div>


                            <Rating
                                name="half-rating"
                                size="medium"
                                value={parseFloat(product.overallRate)}
                                precision={0.1}
                                readOnly


                            />

                            <label style={{ color: 'black', fontSize: '15px', fontWeight: 'bold' }}>{`${product.overallRate} out of five`}</label>
                            <label style={{ color: '#bbb', fontSize: '15px' }}>{`${allRatesInfo.numberOfRates} Rating${allRatesInfo.numberOfRates > 1 ? 's' : ' '}`}</label>

                        </div>

                        <div className="vertical-line" style={{ minHeight: '120px', borderWidth: '1px', margin: '0px 10px 0px 10px' }} ></div>

                        <div className="vr-display" style={{ alignItems: 'flex-start' }} >


                            <div className='hr-display'>
                                <label className='rate-label'>5 Stars</label>
                                <div className="outer-prog">
                                    <div className="inner-prog"
                                        style={{ width: allRatesInfo.fiveStars ? allRatesInfo.fiveStars.pct : '0%' }} ></div>
                                </div>
                                <label className='rate-label'>{`(${allRatesInfo.fiveStars ? allRatesInfo.fiveStars.ctr : 0})`}</label>
                            </div>
                            <div className='hr-display'>
                                <label className='rate-label'>4 Stars</label>
                                <div className="outer-prog">
                                    <div className="inner-prog"
                                        style={{ width: allRatesInfo.fourStars ? allRatesInfo.fourStars.pct : '0%' }} ></div>
                                </div>
                                <label className='rate-label'>{`(${allRatesInfo.fourStars ? allRatesInfo.fourStars.ctr : 0})`}</label>

                            </div>
                            <div className='hr-display'>
                                <label className='rate-label'>3 Stars</label>
                                <div className="outer-prog">
                                    <div className="inner-prog"
                                        style={{ width: allRatesInfo.threeStars ? allRatesInfo.threeStars.pct : '0%' }} ></div>

                                </div>
                                <label className='rate-label'>{`(${allRatesInfo.threeStars ? allRatesInfo.threeStars.ctr : 0})`}</label>

                            </div>
                            <div className='hr-display'>
                                <label className='rate-label'>2 Stars</label>
                                <div className="outer-prog">
                                    <div className="inner-prog"
                                        style={{ width: allRatesInfo.twoStars ? allRatesInfo.twoStars.pct : '0%' }} ></div>
                                </div>
                                <label className='rate-label'>{`(${allRatesInfo.twoStars ? allRatesInfo.twoStars.ctr : 0})`}</label>

                            </div>
                            <div className='hr-display'>
                                <label className='rate-label'>1 Stars</label>
                                <div className="outer-prog">
                                    <div className="inner-prog"
                                        style={{ width: allRatesInfo.oneStar ? allRatesInfo.oneStar.pct : '0%' }} ></div>
                                </div>
                                <label className='rate-label'>{`(${allRatesInfo.oneStar ? allRatesInfo.oneStar.ctr : 0})`}</label>

                            </div>


                        </div>


                        {
                            user._id && !user.admin && <div className="vertical-line" style={{ minHeight: '120px', borderWidth: '1px', margin: '0px 10px 0px 10px' }} ></div>
                        }

                        {
                            user._id && !user.admin && <div className='vr-display' style={{ alignItems: 'left' }}>


                                <label style={{ color: 'black', fontSize: '17px', fontWeight: 'bold', marginBottom: '5px' }}>{'Rate this Product'}</label>

                                <Rating
                                    name="simple-controlled"
                                    size="large"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        addRate(product._id, user._id, newValue, value)
                                    }}
                                />
                                <label style={{ color: '#555', fontSize: '13px', marginTop: '10px' }}>{'Thank you for rating !'}</label>

                                <Link to={`/ReviewForm/${product._id}`} style={{ textDecoration: "none " }}>
                                    <div style={{ color: '#168ba8' }}>{'Write a full review'}</div>
                                </Link>

                            </div>
                        }


                    </div>

                    <div className="reviews" >
                        {
                            product.reviews.map(rev => (

                                rev.review && <div className='vr-display'
                                    key={rev._id}
                                    style={{ alignItems: 'flex-start', margin: '5px 10px 5px 10px' }}>
                                    <hr style={{ borderTopWidth: '0px', width: '100%', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />

                                    <Rating
                                        name="half-rating"
                                        size="small"
                                        value={rev.rate}
                                        readOnly
                                    />

                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ color: '#555' }}>By </label>
                                        <label style={{ color: '#111', fontWeight: '600' }}>{rev.review.userName} </label>
                                        <label style={{ color: '#555' }}>{` on ${dateFormat(rev.review.date, "dddd, mmmm dS, yyyy")}`}</label>
                                    </div>

                                    <label style={{ color: '#888', marginBottom: '10px' }}>{rev.review.review} </label>


                                    {
                                        rev.review.whatsGood !== '' && <label style={{ color: '#114eab' }}>WHAT'S GOOD ABOUT THIS PRODUCT</label>
                                    }
                                    {
                                        rev.review.whatsGood !== '' && <label style={{ color: '#888', marginBottom: '10px' }}>{rev.review.whatsGood} </label>
                                    }
                                    {
                                        rev.review.whatsNotGood !== '' && <label style={{ color: '#114eab' }}>WHAT'S NOT GOOD ABOUT THIS PRODUCT</label>
                                    }
                                    {
                                        rev.review.whatsNotGood !== '' && <label style={{ color: '#888', marginBottom: '10px' }}>{rev.review.whatsNotGood} </label>
                                    }

                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >

            :
            <div className="center-pos" style={{ minHeight: '70vh' }}>
                <CircularProgress disableShrink style={{ color: '#ddd', margin: '20px' }} />
                <label
                    style={{ fontSize: '25px', fontWeight: '700', color: '#ddd', letterSpacing: '2px' }}
                >Loading Product</label>
            </div>
    )
}

export default ProductDetails
