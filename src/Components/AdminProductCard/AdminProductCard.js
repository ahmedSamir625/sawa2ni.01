import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';



import { Link } from 'react-router-dom'

import './AdminProductCard.css'

export default function ProductCard({ product, deleteProduct }) {


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


        </CardContent>
      </Link>

      <CardActions disableSpacing style={{ paddingBottom: 0, paddingTop: 0 }}>
        <Link to={`/editProduct/${product._id}`}>

          <div className="icon-btn" >
            <EditIcon style={{ color: '#888' }} />
          </div>
        </Link>

        <div className="icon-btn" onClick={deleteProduct}>
          <DeleteOutlineIcon   style={{ color: '#888' }} />
        </div>



      </CardActions>

    </Card>



  );
}
