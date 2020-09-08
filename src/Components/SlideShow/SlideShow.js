import React from 'react'
import { Slide } from 'react-slideshow-image';


const SlideShow = (props) => {
  

    const properties = {
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true,
        pauseOnHover: true,

    }

    return (
        <div >
            <div className="slide-container" >
                <Slide {...properties}>
                    {
                        props.urls.map(url => (
                            <div className="each-slide" style={{ alignItems: "center" }} key={url}>
                                <div>
                                    <img style={{minHeight:"400px", maxHeight: "400px", width:"auto" }} src={url} alt="ahmed" />
                                </div>
                            </div>
                        ))
                    }

                </Slide>
            </div>
        </div>

    )
}

export default SlideShow
