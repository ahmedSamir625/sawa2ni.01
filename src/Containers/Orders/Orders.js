import React, { useEffect, useState, useContext } from 'react'

import OrderCard from '../../Components/OrderCard/OrderCard'
import OrdersTabs from '../../Components/OrdersTabs';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../../Providers/UserContext'

import {server} from '../../Constants'
import purchaseOrder from './purchaseOrder.png'
import './Orders.css'


const Orders = () => {
    const [user,] = useContext(UserContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const [filterByOption, setFilterByOption] = useState('all')


    useEffect(() => {

        if (user.admin) {
            fetch(`${server}getOrders`)
                .then(response => response.json())
                .then(data => {
                    setOrders(data)
                    setLoading(false)
                })
                .catch(() => {
                    alert('Something went wrong!')
                })
        }
        else {

            if (user.orders) {
                let userOrders = []

                user.orders.forEach(item => {
                    userOrders.push(item)
                });

                fetch(`${server}getUserOrders`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: userOrders })
                })
                    .then(response => response.json())
                    .then(data => {
                        setOrders(data)
                        setLoading(false)

                    })
                    .catch(() => {
                        alert('Something went wrong!')
                    })

            }
        }
    }, [user])

    useEffect(() => {
        setLoading(true)
        fetch(`${server}getOrders`)
            .then(response => response.json())
            .then(data => {
                setLoading(false)


                switch (filterByOption) {
                    case 'all':
                        setOrders(data)
                        break;

                    case 'pending':
                        setOrders(data.filter(order => !order.state.delivered))

                        break;
                    case 'delivered':
                        setOrders(data.filter(order => order.state.delivered))
                        break;

                }

            })
            .catch(() => {
                alert('Something went wrong!')
            })




    }, [filterByOption])

    const filterBy = (option) => {
        setFilterByOption(option)
    }



    return (
        <div>
            {user.admin && <OrdersTabs filerBy={filterBy} />}
            <div className='display-cards'  >
                {
                    loading
                        ? <div className="center-pos" style={{ minHeight: '70vh' }}>
                            <CircularProgress disableShrink style={{ color: '#ddd', margin: '20px' }} />
                            <label
                                style={{ fontSize: '25px', fontWeight: '700', color: '#ddd', letterSpacing: '2px' }}
                            >Loading Orders</label>
                        </div>
                        : (
                            orders.length
                                ? orders.map(order => (
                                    <OrderCard key={order._id} order={order} isAdmin={user.admin} />
                                ))
                                : <div className="center-pos" style={{ minHeight: '70vh' }}>
                                    < img src={purchaseOrder}
                                    />
                                    <h2 style={{ color: '#ccc' }}>No Orders yet!</h2>
                                </div>
                        )


                }
            </div>

        </div>



    )
}

export default Orders
