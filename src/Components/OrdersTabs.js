import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';




function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#fff',
        color: '#d66',
        position: 'fixed',
        width: "95%"
    },
    backgroundColor: '#ffffff'

}));


export default function NavTabs({ filerBy }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div  >
            <AppBar className={classes.root} position="static">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                >
                    <LinkTab label="All Orders" onClick={filerBy.bind(this, 'all')} />
                    <LinkTab label="Pending Orders" onClick={filerBy.bind(this, 'pending')} />
                    <LinkTab label="Delivered Orders" onClick={filerBy.bind(this, 'delivered')} />
                </Tabs>
            </AppBar>

        </div>
    );
}
