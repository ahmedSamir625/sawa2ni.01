import React, { useState, useEffect } from 'react'
import './ImagePicker.css'


const ImagePicker = (props) => {

    const [imgs, setImgs] = useState([])

    useEffect(() => {
        setImgs(props.images)
    }, [props.images])


    const onImageAdd = (event) => {


        if (event.target.files.length !== 0) {
            let imgUrls = []
            const files = Object.values(event.target.files);
            files.forEach(file => {
                imgUrls.push(URL.createObjectURL(file))
            });
            setImgs(imgUrls)
            props.onImageUpload(Object.values(event.target.files))
        }
    }

    return (
        <div>
            <div className="imgs container">
                {imgs.length === 0
                    ? <img height="100%" width="100%" src="https://cdn1.iconfinder.com/data/icons/photo-18/512/Untitled-126-512.png" alt="" />
                    : imgs.map(img => (
                        <img className="img-style" src={img} key={img} alt="img" />
                    ))
                }
            </div>
            {
                !props.images.length &&
                <div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <i className="fa fa-cloud-upload"></i>Upload Photos</label>
                    <input required id="file-upload" type="file" accept="image/*" multiple onChange={onImageAdd} />
                </div>
            }
        </div>


    )
}

export default ImagePicker
