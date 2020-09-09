import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import {server} from '../../Constants';
import './OrderCard.css'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

var dateFormat = require('dateformat');

const muiTheme = createMuiTheme({
    overrides: {
        MuiStepIcon: {
            root: {
                color: '#ccc',
                '&$active': {
                    color: '#ffe6bf',
                },
                '&$completed': {
                    color: '#f90',
                },
            },
        },
    },
    width: '100%'
});



const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
    },
}));


const OrderCard = ({ order, isAdmin }) => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0)
    const [showMore, setShowMore] = useState(false)

    const [steps, setSteps] = useState([['In Processing', null], ['Shipped', null], ['Delivered', null]])


    useEffect(() => {
        if (order.state) {
            const x = [...steps]
            for (let i = 0; i < steps.length; i++) {
                x[0][1] = order.state.inProcessing ? order.state.inProcessing : null
                x[1][1] = order.state.shipped ? order.state.shipped : null
                x[2][1] = order.state.delivered ? order.state.delivered : null
            }

            setSteps(x)
        }
    }, [])


    useEffect(() => {
        if (order.state) {
            if (order.state.delivered) {
                setActiveStep(3)
            }
            else if (order.state.shipped) {
                setActiveStep(2)
            }
            else if (order.state.inProcessing) {
                setActiveStep(1)
            }
        }

    }, [])


    const handleNext = () => {

        const _currentStep = activeStep
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        fetch(`${server}nextOrderStep`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order._id, step: _currentStep + 1 })
        })
            .then(response => response.json())
            .catch(() => {
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
            })
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        const _currentStep = activeStep

        fetch(`${server}prevOrderStep`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order._id, step: _currentStep })
        })
            .then(response => response.json())
    
            .catch(() => {
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
            })
    };

    const handleReset = () => {
        setActiveStep(0);
        fetch(`${server}resetOrderStep`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order._id })
        })
            .then(response => response.json())
            .catch(() => {
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
            })
    };


    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    return (
        <div className='uoc-style'>

            <div className="details">
                <div style={{ textAlign: 'left' }}>
                    <label style={{ color: "#888" }}>Order ID</label><br />
                    <label style={{ wordBreak: 'break-all', color: "#cc5f06", fontWeight: "600" }}>{order._id}</label>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <label style={{ color: "#888", marginLeft: '15px' }}>{'Order Date'}</label><br />
                    <label style={{ color: "#cc5f06", fontWeight: "600", marginLeft: '15px' }}>{dateFormat(order.date, "dddd, mmmm dS, yyyy, h:MM TT")}</label>
                </div>

            </div>

            <MuiThemeProvider theme={muiTheme} >

                <Stepper activeStep={activeStep} alternativeLabel >
                    {steps.map((label) => (
                        <Step key={label[0]} >
                            {
                                isAdmin
                                    ? <StepLabel>{`${label[0]}. \n ${label[1] ? dateFormat(label[1], "dddd, mmmm dS, yyyy") : ''}`}</StepLabel>
                                    : <StepLabel>{`${label[0]}`}</StepLabel>
                            }
                        </Step>
                    ))}
                </Stepper>
            </MuiThemeProvider>

            {

                <div >
                    {
                        isAdmin && (
                            activeStep === steps.length ? (
                                <div>
                                    <label style={{ color: '#5a5' }} className={classes.instructions}>Order is Delivered Successfully !</label><br />
                                    <button className="back-btn" onClick={handleReset}>Reset</button>
                                </div>
                            ) : (
                                    <div>
                                        <label style={{ color: '#777' }} className={classes.instructions}>{'Go to Next Step'}</label><br />
                                        <div>
                                            <button className="back-btn" onClick={handleBack} disabled={activeStep === 0} >Back</button>
                                            <button className="next-btn" onClick={handleNext}  >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </button>
                                        </div>
                                    </div>
                                )
                        )
                    }

                    {
                        isAdmin && <div>
                            <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />

                            <div style={{ textAlignLast: 'left', color: "#111", fontWeight: 'bold', marginTop: '15px', marginBottom: '5px' }}
                            >User Information</div>

                            <div className="hr-display" style={{ justifyContent: 'space-between' }}>
                                <label style={{ marginLeft: '20px', color: "#777" }}> ID</label>
                                <label style={{ color: "#777", fontWeight: 'bold' }}>{order.user.id}</label>
                            </div>

                            <div className="hr-display" style={{ justifyContent: 'space-between' }}>
                                <label style={{ marginLeft: '20px', color: "#777" }}>Full Name</label>
                                <label style={{ color: "#777", fontWeight: 'bold' }}>{`${order.user.name.firstName} ${order.user.name.lastName}`}</label>
                            </div>

                            <div className="hr-display" style={{ justifyContent: 'space-between' }}>
                                <label style={{ marginLeft: '20px', color: "#777" }}>Phone Number</label>
                                <label style={{ color: "#777", fontWeight: 'bold' }}>{`${order.user.phoneNumber.code} ${order.user.phoneNumber.number}`}</label>
                            </div>

                            <div style={{ marginLeft: '20px', textAlignLast: 'left', color: "#777" }} >Address Information</div>

                            <div className="hr-display" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <label style={{ textAlignLast: 'left', marginLeft: '40px', color: "#777", minWidth: '100px' }}>Address</label>
                                <label style={{ color: "#777", textAlign: 'right', fontWeight: 'bold' }}>{order.user.addressInfo.address} </label>
                            </div>

                            <div className="hr-display" style={{ justifyContent: 'space-between' }}>
                                <label style={{ textAlignLast: 'left', marginLeft: '40px', color: "#777", minWidth: '100px' }}>City</label>
                                <label style={{ color: "#777", textAlign: 'right', fontWeight: 'bold' }}>{order.user.addressInfo.city}</label>
                            </div>

                            <div className="hr-display" style={{ justifyContent: 'space-between' }}>
                                <label style={{ textAlignLast: 'left', marginLeft: '40px', color: "#777", minWidth: '100px' }}>Province</label>
                                <label style={{ color: "#777", textAlign: 'right', fontWeight: 'bold' }}>{order.user.addressInfo.province}</label>
                            </div>


                        </div>
                    }


                    <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px', marginTop: '5px' }} />


                    <div className="split">
                        <div>
                            <label style={{ color: "#777", marginRight: '20px' }}>{`Number Of Items`}</label>
                            <label style={{ color: "#555", fontWeight: 'bold' }}>{`${order.items.length}`}</label>
                        </div>

                        <div className="show-more" onClick={toggleShowMore}>
                            <label className="show-more-text"> {showMore ? 'Show Less' : 'Show More'}</label>
                            {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                    </div>

                    <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />



                    {showMore && order.items.map(item => (
                        <div key={item._id} >
                            <div className="summary-item">
                                <img src={item.image}
                                    alt="item" className="summary-item-image" />

                                <div className="summary-item-info">
                                    <label style={{ marginLeft: '10px', }}>{item.name}</label>
                                    <label style={{ marginLeft: '10px', color: "#494" }}>{`${item.price} £`}</label>
                                    <label style={{ marginLeft: '10px', color: "#777" }}>
                                        {`Qty: ${item.amount}`}
                                    </label>
                                    <label style={{ marginLeft: '10px', color: "#777" }}>
                                        {`Item Total ${(item.price * item.amount).toFixed(2)} £`}

                                    </label>
                                </div>
                            </div>
                            <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '5px', marginTop: "5px" }} />
                        </div>
                    ))}


                    <div className="split">
                        <label style={{ color: "#777" }}>{`Sub Total`}</label>
                        <label style={{ color: "#fd5656" }}>{`${order.totalPayment.toFixed(2)} £`}</label>
                    </div>

                    <div className="split">
                        <label style={{ color: "#777" }}>{`Shipment`}</label>
                        <label style={{ color: "#fd5656" }}>{`${order.shipmentPrice} £`}</label>
                    </div>
                    <hr style={{ borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#ddd', marginBottom: '10px' }} />

                    <div className="split">
                        <label style={{ color: "#555", fontWeight: "600" }}>{`Total`}</label>
                        <label style={{ color: "#fd5656", fontWeight: "600" }}>{`${(order.totalPayment + order.shipmentPrice).toFixed(2)} £`}</label>
                    </div>
                </div>
            }

        </div>
    );
}
export default OrderCard