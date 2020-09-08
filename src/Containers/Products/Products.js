import React, { useState, useEffect, useContext } from 'react'
import ScrollableTabsButtonAuto from '../../Components/CategoriesTabs/Tabs'
import UserProductCard from '../../Components/UserProductCard/UserProductCard'
import AdminProductCard from '../../Components/AdminProductCard/AdminProductCard'
import CircularProgress from '@material-ui/core/CircularProgress';

import { UserContext } from '../../Providers/UserContext'

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom'
import './Products.css'
import { server } from '../../Constants'

const itemsPerPage = 100


const Products = () => {

    const [user,] = useContext(UserContext)
    const [allProducts, setAllProducts] = useState([])
    const [products, setProducts] = useState([])
    const [pages, setPages] = useState([0])
    const [pageIndex, setPageIndex] = useState(0)
    const [catId, setCatId] = useState('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        fetch(server)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data)
                countPages(data.length)

                const viewedProducts = data.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
                setProducts(viewedProducts)

                if (data.length) {
                    document.getElementById(`page-btn-${pageIndex + 1}`).style.color = "#ff8000"
                    document.getElementById(`page-btn-${pageIndex + 1}`).style.borderColor = "#ff8000"
                }

                setLoading(false)

            })
            .catch(() => {
                alert('Something went wrong!')
            })
    }, [])





    const countPages = (arrLength) => {
        let _pages = []
        for (let i = 0; i < Math.ceil(arrLength / itemsPerPage); i++) {
            _pages.push(i)
        }
        setPages(_pages)
    }

    const highlightPageBtn = (option) => {
        if (products.length) {
            if (option) {
                document.getElementById(`page-btn-${pageIndex + 1}`).style.color = "#ff8000"
                document.getElementById(`page-btn-${pageIndex + 1}`).style.borderColor = "#ff8000"
            }
            else {
                document.getElementById(`page-btn-${pageIndex + 1}`).style.color = "#888"
                document.getElementById(`page-btn-${pageIndex + 1}`).style.borderColor = "#cccccc"
            }
        }

    }

    useEffect(() => {
        if (catId === 'All') {

            const viewedProducts = allProducts.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
            setProducts(viewedProducts)
            countPages(allProducts.length)
            highlightPageBtn(1)
        }
        else {
            const catProducts = allProducts.filter(product => product.categories.find(cat => cat === catId))
            const viewedProducts = catProducts.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)

            setProducts(viewedProducts)
            countPages(catProducts.length)
            highlightPageBtn(1)
        }

    }, [catId, pageIndex])


    const getCategoryId = (id) => {
        setCatId(id)
        setPageIndex(0)
        highlightPageBtn(0)
    }

    const updatePageIndex = (page) => {
        if (page !== pageIndex)
            highlightPageBtn(0)
        setPageIndex(page)
    }

    const deleteProduct = (index) => {

        fetch(`${server}deleteProduct`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: products[index]._id,
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result != null && result !== "cannot delete the product") {

                    const _products = [...products]
                    _products.splice(index, 1);
                    setProducts(_products)
                }
            })
            .catch(() => alert('Something went wrong !'))
    }


    return (

        <div >
            <ScrollableTabsButtonAuto getCategoryId={getCategoryId} />
            <div >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {
                        loading
                            ? <div className="center-pos" style={{ minHeight: '50vh' }}>
                                <CircularProgress disableShrink style={{ color: '#ddd', margin: '20px' }} />
                                <label
                                    style={{ fontSize: '25px', fontWeight: '700', color: '#ddd', letterSpacing: '2px' }}
                                >Loading Products</label>
                            </div>

                            : (
                                user.admin
                                    ? products.map((product, index) => (
                                        <AdminProductCard key={product._id}
                                            product={product}
                                            deleteProduct={deleteProduct.bind(this, index)}
                                        />))
                                    :
                                    products.map(product => (
                                        <UserProductCard key={product._id}
                                            product={product}
                                            inCart={user.cart && user.cart.find(item => item.productId === product._id)}
                                        />
                                    ))
                            )
                    }
                </div>

                {
                    products.length ?
                        <div className='page-btn-container'>
                            {
                                pages.map((page) => (
                                    <button
                                        key={page}
                                        id={`page-btn-${page + 1}`}
                                        onClick={updatePageIndex.bind(this, page)}
                                        className="page-btn"
                                    >
                                        {page + 1}
                                    </button>
                                ))
                            }
                        </div>
                        : ''
                }

            </div>

            {
                user.admin &&
                <Link to={'/AddProduct'}>
                    <Fab style={{ backgroundColor: "#ff9900", color: "#fff", position: "fixed", bottom: "20px", right: "20px" }} aria-label="add" >
                        <AddIcon />
                    </Fab>
                </Link>
            }
        </div>



    )
}

export default Products
