import React, { useState, useEffect, useContext } from 'react'
import Rating from '@material-ui/lab/Rating';

import { UserContext } from '../../Providers/UserContext'
import {server} from '../../Constants'

import './ReviewForm.css'
import '../AddProduct/AddProduct.css'



const ReviewForm = ({ match }) => {

    const [user, ] = useContext(UserContext)
    const [whatsGood, setWhatsGood] = useState('')
    const [whatsNotGood, setWhatsNotGood] = useState('')
    const [review, setreview] = useState('')
    const [rate, setRate] = useState(3)
    const [hasOldRate, setHasOldRate] = useState(true)
    const [product, setProduct] = useState({})


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
                rev ? setRate(rev.rate) : setHasOldRate(false)

            })
            .catch(() => alert('Something went wrong !'))

    }, [user])


    const updateWhatsGood = (event) => {
        setWhatsGood(event.target.value)
    }
    const updateWhatsNotGood = (event) => {
        setWhatsNotGood(event.target.value)
    }
    const updateReview = (event) => {
        setreview(event.target.value)
    }

    const submitReview = (event) => {
        event.preventDefault();

        let newOverall = 0
        const numberOfRates = product.reviews.length

        if (hasOldRate) {
            const rev = product.reviews.find(rev => rev.userId === user._id)
            newOverall = ((product.overallRate * numberOfRates) - rev.rate + rate) / numberOfRates
        }
        else {
            newOverall = ((product.overallRate * numberOfRates) + rate) / (numberOfRates + 1)
        }

        const reviewInfo = {
            userId: user._id,
            rate: rate,
            review: {
                userName:user.name.firstName,
                date: new Date(),
                whatsGood: whatsGood,
                whatsNotGood: whatsNotGood,
                review: review
            }
        }


        fetch(`${server}addReview`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hasRate: hasOldRate,
                productId: product._id,
                overAllRate: newOverall.toFixed(1),
                reviewInfo: reviewInfo
            })
        })
            .then(response => response.json())
            .then(() => {
                window.location.href = `/ProductDetails/${product._id}/`
            })
            .catch(() => alert('something went wrong!'))
    }


    return (
        <form className="form-style" onSubmit={submitReview} >

            <div className="overview">
                <img
                    className="overview-img"
                    src={product._id && product.images[0]} alt="product image" />
                <label
                    style={{
                        color: '#3495eb',
                        fontSize: '16px',
                        marginTop: '5px',
                        fontWeight: '500',
                        letterSpacing: '.5px'
                    }}
                > {product._id && product.name} </label>
            </div>

            <Rating
                name="simple-controlled"
                size="medium"
                value={rate}
                onChange={(event, newValue) => {
                    setRate(newValue)
                }}
            />


            <h4><i>Thank You for Rating! Tell us more about your opinion :</i></h4>

            <label style={{ paddingLeft: "5px" }} > What's good about this product?</label>

            <input
                type="text"
                name="what-good"
                className="input-style"
                onChange={updateWhatsGood}

            />

            <label style={{ paddingLeft: "5px" }} > What's not good about this product?</label>
            <input
                type="text"
                name="whats-not-good"
                className="input-style"
                onChange={updateWhatsNotGood}

            />

            <label style={{ paddingLeft: "5px" }}> Write your review *</label>
            <textarea
                onChange={updateReview}
                required
                placeholder="Write your review here. Consider why did you choose this rating? And what did you like or dislike about this product?"
                rows='1'
                wrap='on'
                autoCapitalize='on'
                type="text"
                name="review"
                className="input-style" style={{ height: '200px' }} />

            <button type="submit" className="submit-btn" >Submit</button>
        </form>
    )
}

export default ReviewForm
