import React, { useEffect, useState } from 'react'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextBox from '../../Components/TextBox/TextBox'
import './Categories.css'

import CategoryItem from '../../Components/CategoryItem/CategoryItem'
import {server} from '../../Constants';

const Categories = () => {

    const [categories, setCategories] = useState([])
    const [addClicked, setAddClicked] = useState(false)
    const [input, setInput] = useState('')


    useEffect(() => {
        fetch(`${server}getCategories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data)
            })
            .catch(() => alert('Something Went Wrong!'))
    }, [])

    const onCancelClick = () => {
        setAddClicked(false)
    }

    const showTextBox = () => {
        setAddClicked(true)
    }

    const onInputChange = (event) => {
        setInput(event.target.value)
    }

    const deleteCategory = (index) => {

        fetch(`${server}deleteCategory`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: categories[index]._id,
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result != null && result !== "cannot delete the category") {

                    const cats = [...categories]
                    cats.splice(index, 1);
                    setCategories(cats)
                }
            })
            .catch(() => alert('Something went wrong !'))
    }

    const onAddClicked = () => {
        const category = {
            name: input
        }

        fetch(`${server}addCategory`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        })
            .then(response => response.json())
            .then(cat => {
                if (cat !== 'connot be inserted') {
                    setAddClicked(false)

                    const cats = [...categories]
                    cats.push(cat)
                    setCategories(cats)

                }
                else {
                    alert('Cannot be added')
                }
            })
            .catch(() => alert('Cannot connect to server try again later'))
    }


    return (
        <div>

            {
                categories.map((category, index) => (
                    <CategoryItem deleteCategory={deleteCategory.bind(this, index)} key={category._id} category={category} />
                ))
            }

            {
                addClicked
                    ? <TextBox
                        onCancelClick={onCancelClick}
                        onAddClick={onAddClicked}
                        onInputChange={onInputChange}
                    />
                    : <Fab onClick={showTextBox} style={{ backgroundColor: "#fff", color: "#ff9900", position: "fixed", bottom: "20px", right: "20px" }} aria-label="add" >
                        <AddIcon />
                    </Fab>
            }
        </div>
    )
}

export default Categories
