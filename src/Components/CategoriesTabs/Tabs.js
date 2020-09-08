import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {server} from '../../Constants'



const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: '10px',
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function ScrollableTabsButtonAuto({ getCategoryId }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [categories, setCategories] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetch(`${server}getCategories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data)
            })
    }, [])

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    style={{ backgroundColor: '#fff', height: '10px' }}
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab style={{ fontSize: '11px'  }} label='All' onClick={getCategoryId.bind(this, 'All')} />
                    {
                        categories.map(cat => (
                            <Tab style={{ fontSize: '11px' }} key={cat._id} label={cat.name} onClick={getCategoryId.bind(this, cat._id)} />
                        ))
                    }

                </Tabs>
            </AppBar>

        </div>
    );
}
