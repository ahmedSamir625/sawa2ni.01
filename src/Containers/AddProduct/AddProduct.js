import React, { useState, useEffect } from 'react'
import './AddProduct.css'
import ImagePicker from '../../Components/ImagePicker/ImagePicker'
import { storage } from "../../Firebase"
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {server} from '../../Constants';

// import Button from '@material-ui/core/Button';
// import Snackbar from '@material-ui/core/Snackbar';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}));



const initialProductState = {
    name: '',
    price: 1,
    details: '',
    amount: 1,
    categories: [],
    imgs: []
}

const AddProduct = ({ match }) => {
    const classes = useStyles();

    const [openProgress, setOpenProgress] = React.useState(false);
    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleToggleProgress = () => {
        setOpenProgress(!openProgress);
    };

    // const [openSnackBar, setOpenSnackBar] = React.useState(false);

    // const handleClickSnackBar = () => {
    //     setOpenSnackBar(true);
    // };

    // const handleCloseSnackBar = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpenSnackBar(false);
    // };



    const [product, setProduct] = useState(initialProductState)
    const [loading, setLoading] = useState(false)

    const [imgFiles, setImgFiles] = useState([])
    const [categories, setCategories] = useState([])



    useEffect(() => {
        fetch(`${server}getCategories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data)
            })
    }, [])

    useEffect(() => {
        if (match.params.id) {
            fetch(`${server}getProduct`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: match.params.id })
            })
                .then(response => response.json())
                .then(_product => {

                    setProduct({
                        name: _product.name,
                        price: _product.price,
                        details: _product.details,
                        categories: _product.categories,
                        amount: _product.amount,
                        imgs: _product.images,
                    })

                    _product.categories.forEach(id => {
                        document.getElementById(id).checked = true
                    });
                })
                .catch(() => alert('Something went wrong'))
        }
    }, [])

    const updateName = (event) => {
        setProduct({ ...product, name: event.target.value })
    }

    const updatePrice = (event) => {
        setProduct({ ...product, price: event.target.value })
    }

    const updateDetails = (event) => {
        setProduct({ ...product, details: event.target.value })
    }

    const updateAmount = (event) => {
        setProduct({ ...product, amount: event.target.value })
    }

    const addImages = (images) => {
        setImgFiles(images)
    }

    const updateProductCategories = (event) => {

        if (event.target.checked) {
            const cats = [...product.categories]
            cats.push(event.target.value)
            setProduct({ ...product, categories: cats })
        }
        else {
            const cats = [...product.categories]
            var index = cats.indexOf(event.target.value);
            if (index !== -1) cats.splice(index, 1);
            setProduct({ ...product, categories: cats })
        }
    }

    const addProduct = async () => {
        handleToggleProgress()
        setLoading(true)
        if (imgFiles.length === 0) {
            alert('Please choose at least one image!')
        }
        else if (product.categories.length === 0) {
            alert('Please choose at least one category!')
        }
        else {
            let uploadPromises = imgFiles.map(imgFile => {
                return storage.ref(`images/${imgFile.name}`).put(imgFile)
            })

            Promise.all(uploadPromises)
                .then(files => {
                    let urls = files.map(file => (
                        storage
                            .ref("images")
                            .child(file.metadata.name)
                            .getDownloadURL()
                    ))
                    Promise.all(urls).then(_urls => {
                        setProduct({ ...product, imgs: _urls })

                        fetch(`${server}addProduct`, {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...product, images: _urls })
                        })
                            .then(response => response.json())
                            .then(id => {
                                if (id === 'connot be inserted') {
                                    alert('Cannot be added')
                                    setLoading(false)
                                }
                                else {
                                    setLoading(false)

                                    // handleClickSnackBar()

                                    window.location.reload(false);
                                }
                            })
                            .catch(() => {
                                alert('Cannot connect to server try again later')
                                setLoading(false)

                            })
                    })
                })
        }
    }

    const editProduct = () => {

        fetch(`${server}editProduct`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: product, id: match.params.id })
        })
            .then(response => response.json())
            .then(res => {
                if (res._id) {
                    setProduct(product)
                    window.location.reload(false);
                }
                else {
                    alert('Cannot be edited')
                }
            })
            .catch(() => alert('Cannot connect to server try again later'))
    }


    const submit = (event) => {
        event.preventDefault();

        if (match.params.id) {
            editProduct(event)
        }
        else {
            addProduct()
        }
    }

    return (



        <div className="display-style">
            {loading && <Backdrop className={classes.backdrop} open={openProgress} onClick={handleCloseProgress}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <form className="form-style" onSubmit={submit}>
                <label style={{ paddingLeft: "5px" }} > Product Name *</label>
                <input id="product-name" type="text" name="name" required placeholder="Enter a Name for the Product" className="input-style"
                    value={product.name}
                    onChange={updateName} />

                <label style={{ paddingLeft: "5px" }}> Price *</label>
                <input id="price" type="number" name="price" required min='0.1' step="0.1" placeholder="Enter a Positive Number"
                    onChange={updatePrice} className="input-style"
                    value={product.price} />

                <label style={{ paddingLeft: "5px" }}> Details</label>
                <textarea
                    value={product.details}
                    placeholder="write the product details"
                    id="details"
                    rows='1'
                    wrap='on'
                    autoCapitalize='on'
                    type="text" name="details" onChange={updateDetails} className="input-style" style={{ height: '200px' }} />

                <label style={{ paddingLeft: "5px" }}> Available Amount *</label>
                <input id="amount" type="number" name="amount" required min='1' placeholder="Enter the Available amount"
                    onChange={updateAmount} className="input-style"
                    value={product.amount} />


                <fieldset required className='cats-fieldset' style={{ padding: '10px' }}>
                    <legend style={{ paddingLeft: "5px", color: '#db720f' }}>Categories *</legend>
                    {
                        categories.map(cat => (
                            <div key={cat._id} >
                                <input type="checkbox" className='check-box' id={cat._id} value={cat._id} onChange={updateProductCategories} />
                                <label style={{ marginLeft: '10px', color: '#555' }}>{cat.name}</label> <br />
                            </div>
                        ))
                    }

                </fieldset>
                <button type="submit" className="submit-btn" >Submit</button>
            </form>
            <div className="add-image">
                <ImagePicker
                    inEdit={match.params.id}
                    images={product.imgs}
                    onImageUpload={addImages} />
            </div>



        </div>



    )
}

export default AddProduct
