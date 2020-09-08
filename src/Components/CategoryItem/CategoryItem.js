import React from 'react'
import './CategoryItem.css'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const CategoryItem = (props) => {
    const { category, deleteCategory } = props
    return (
        <div className="cat-item">
            <label>{category.name}</label>


            <div className="icon-btn" onClick={deleteCategory}>
                <DeleteOutlineIcon style={{ color: '#888' }} />
            </div>
        </div>
    )
}

export default CategoryItem
