import React from 'react';
import './TextBox.css';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const TextBox = (props) => {
    const { onCancelClick, onAddClick, onInputChange } = props;

    return (
        <div className="textbox-position textbox-style center">

            <div style={{ display: 'flex', width: '80%', marginLeft: '10px' }}>
                <input type='text' className="cat-input-style"
                    onChange={onInputChange}
                />
                <button
                    className="add-cat-btn"
                    onClick={onAddClick}
                >ADD</button>
            </div>

            <IconButton aria-label="share" onClick={onCancelClick}>
                <CloseIcon />
            </IconButton>
        </div>
    );
}


export default TextBox
