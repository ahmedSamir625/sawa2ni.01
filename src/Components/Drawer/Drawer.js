import React, { useState, useContext, useEffect } from 'react';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserContext } from '../../Providers/UserContext'
import Cookies from 'js-cookie'
//-------------------------------------------
import Products from '../../Containers/Products/Products';
import ProductDetails from '../../Containers/ProductDetails/ProductDetails'
import AddProduct from '../../Containers/AddProduct/AddProduct'
import MyCart from '../../Containers/MyCart/MyCart'
import Categories from '../../Containers/Categories/Categories';
import OrderDetailsForm from '../../Containers/OrderDetailsForm/OrderDetailsForm';
import Orders from '../../Containers/Orders/Orders';
import ReviewForm from '../../Containers/ReviewForm/ReviewForm';
// import AuthForm from '../../Containers/AuthenticationForm/AuthForm';


//-------------------------------------------
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ShoppingCartOutlined, StorefrontOutlined, ExitToAppOutlined, PersonOutline } from '@material-ui/icons';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';

import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        boxShadow: "0px 0px 0px 0px #fff",
        height: "63.99px",
        minHeight: "56px",
        backgroundImage: 'linear-gradient(4deg, rgb(236, 206, 0)0%,rgb(236, 220, 0)5%, rgb(255, 0, 100) 100%)',

        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {

        flexGrow: 1,
        // padding: "10px",
        width: '90%',
        // height:'100%'
        // maxWidth:'90%'
    },

    avatar: {
        height: '100px',
        width: '100px',
        minWidth: '100px',
        minHeight: '100px',
        color: 'rgb(255, 255, 255)',
        fontSize: '30px',
        backgroundColor: 'rgb(185, 185, 185)',
        borderRadius: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: '20px'
    }
}));


export default function MiniDrawer({ loggedUser }) {
    const [user, setUser] = useContext(UserContext)

    useEffect(() => {

        setUser(loggedUser)

    }, [])

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const getDrawerIcons = (index) => {
        if (user.admin) {
            if (index === 0)
                return <ShoppingCartOutlined />
            else if (index === 1)
                return <CategoryOutlinedIcon />
            else if (index === 2)
                return <LocalShippingOutlinedIcon />
            else if (index === 3)
                return <ExitToAppOutlined />

        }
        else {
            if (index === 0)
                return <StorefrontOutlined />
            else if (index === 1)
                return <ShoppingCartOutlined />
            else if (index === 2)
                return <LocalShippingOutlinedIcon />
            else if (index === 3)
                return <PersonOutline />
            else if (index === 4)
                return <ExitToAppOutlined />
        }
    }

    return (
        <Router>
            <div className={classes.root}>
                <CssBaseline />
                {/* <PrimarySearchAppBar></PrimarySearchAppBar> */}

                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>SAWA2NI</Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >

                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>

                    </div>

                    {
                        open &&
                        <div style={{ display: "contents" }}>
                            <div className={classes.avatar}> {user && (user.name.firstName[0] + user.name.lastName[0])} </div>
                            <label style={{ margin: '10px' }} >{user.name.firstName}</label>
                            <Divider />
                        </div>

                    }


                    <List>

                        <div>
                            {
                                !user.admin ?
                                    [['Home', ''], ['My Cart', 'MyCart'], ['Orders', 'Orders'],].map((text, index) => (
                                        <div key={text[0]}>
                                            <Link to={`/${text[1]}`} style={{ color: "#553300", textDecoration: "none " }} >
                                                <ListItem button  >
                                                    <ListItemIcon >{getDrawerIcons(index)}</ListItemIcon>
                                                    <ListItemText primary={text[0]} />
                                                </ListItem>
                                            </Link>
                                        </div>

                                    ))
                                    :

                                    [['Home', ''], ['Categories', 'Categories'], ['Orders', 'Orders']].map((text, index) => (
                                        <div key={text[0]}>
                                            <Link to={`/${text[1]}`} style={{ color: "#553300", textDecoration: "none " }} >
                                                <ListItem button  >
                                                    <ListItemIcon >{getDrawerIcons(index)}</ListItemIcon>
                                                    <ListItemText primary={text[0]} />
                                                </ListItem>
                                            </Link>
                                        </div>

                                    ))
                            }
                            <Divider />
                            <div onClick={() => {
                                window.location.href = "/"
                                setUser(undefined)
                                Cookies.remove('loggedUser')
                            }}>
                                <ListItem button  >
                                    <ListItemIcon ><ExitToAppOutlined /></ListItemIcon>
                                    <ListItemText primary={'Sign Out'} />
                                </ListItem>
                            </div>

                        </div>

                    </List>
                </Drawer>

                <main className={classes.content}>

                    <div className={classes.toolbar} />

                    <Switch>

                        <Route path="/" exact component={Products} />

                        <Route path="/ProductDetails/:id" component={ProductDetails} />
                        <Route path="/MyCart" component={MyCart} />
                        <Route path="/AddProduct" component={AddProduct} />
                        <Route path="/EditProduct/:id" component={AddProduct} />
                        <Route path="/Categories" component={Categories} />
                        <Route path="/OrderForm" component={OrderDetailsForm} />
                        <Route path="/Orders" component={Orders} />
                        <Route path="/ReviewForm/:id" component={ReviewForm} />

                    </Switch>

                </main>
            </div>

        </Router>

    );
}
