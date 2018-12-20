import React, {Component} from 'react';
import '../details/Details.css';
import Header from '../../common/header/Header';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircle, faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import {faStopCircle} from '@fortawesome/free-regular-svg-icons';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
//import Button from '@material-ui/core/Button';

library.add(faStar, faCircle, faRupeeSign, faStopCircle)

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    icon: {
        margin: theme.spacing.unit,
    },
    card: {},
    badge: {
        margin: theme.spacing.unit * 2,
    }
});

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant: {},
            address: {},
            categories: [],
            snackBarOpen: false,
            snackBarMessage: "",
            cartCounter: 0,
            cartItems: [],
            totalCartValue: 0
        }
    }

    /* ajax call to get data for a given Restaurant */
    componentWillMount() {
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function(){
            if(this.readyState === 4 && this.status === 200) {
                that.setState({
                    restaurant: JSON.parse(this.responseText),
                    address: JSON.parse(this.responseText).address,
                    categories: JSON.parse(this.responseText).categories,
                    items: JSON.parse(this.responseText).categories.items
                });
            }
        });

        xhr.open("GET", this.props.baseUrl + "/restaurant/" + this.props.match.params.restaurantID);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    addButtonClickHandler(item) {
        var found = this.state.cartItems.findIndex(cartItem => cartItem.id === item.id)
        const updatedItem = this.state.cartItems.slice()
        if (found === -1) {
            item.quantity = 1;
            item.cartPrice = item.price;
            updatedItem.push(item)
            this.totalAmountCalc(item.cartPrice)
        } else {
            updatedItem[found].quantity++
            updatedItem[found].cartPrice = item.price * updatedItem[found].quantity
            this.totalAmountCalc(item.price)
        }
        this.setState({cartItems: updatedItem})
        this.setState({cartCounter: this.state.cartCounter + 1})
        this.setState({snackBarOpen: true});
        this.setState({snackBarMessage: "Item added to cart!"})
    }

    /*Calculate the Total Cart Amount*/
    totalAmountCalc (itemValue) {
        this.setState({totalCartValue: this.state.totalCartValue + itemValue})
    }

    removeButtonClickHandler(item) {
        var found = this.state.cartItems.findIndex(cartItem => cartItem.id === item.id)
        const updatedItem = this.state.cartItems.slice()
        if (item.quantity === 1) {
            updatedItem.splice(found, 1)
            this.setState({snackBarOpen: true});
            this.setState({snackBarMessage: "Item removed from cart!"});
        } else {
            updatedItem[found].quantity--
            updatedItem[found].cartPrice = item.price * updatedItem[found].quantity
            this.setState({snackBarOpen: true});
            this.setState({snackBarMessage: "Item quantity decreased by 1!"});
        }
        this.setState({cartItems: updatedItem})
        this.setState({cartCounter: this.state.cartCounter - 1});
        this.state.cartItems.forEach(cartItem => {
            this.setState({totalCartValue: this.state.totalCartValue - item.price})
        });
    }

    /* Close Snack-bar */
    handleClose = event => {
        this.setState({snackBarOpen: false});
    }

    /* Implementing Checkout Functionality*/
    checkoutButtonClickHandler = event => {
        if (this.state.cartCounter === 0 && this.state.cartItems.length === 0) {
            this.setState({snackBarOpen: true});
            this.setState({snackBarMessage: "Please add an item to your cart!"});
            return;
        }
        if (sessionStorage.getItem("access-token") === null) {
            this.setState({snackBarOpen: true});
            this.setState({snackBarMessage: "Please login first!"});
            return;
        }
        this.props.history.push({
            pathname: "/checkout",
            cartItems: this.state.cartItems,
            totalCartValue: this.state.totalCartValue
        });
    }

    render() {
        const restaurant = this.state.restaurant;
        const address = this.state.address;
        const categories = this.state.categories;
        const cartItems = this.state.cartItems;
        const totalCartValue = this.state.totalCartValue;
        const {classes} = this.props;
        return (
            <div className="details-container">
                <Header {...this.props} isHomePage={false}/>
                <div className="restaurant-info">
                    <div className="restaurant-image">

                        <img height="200px" width="auto" alt="restaurant featured" src={restaurant.photoUrl}  />
                    </div>
                    <div className="restaurant-details">
                        <p className="restaurant-title">{restaurant.restaurantName}</p>
                        <p className="restaurant-locality">{address.locality}</p>
                        <p className="restaurant-categories">
                            {categories.map((cat) =>
                                (
                                    <span className="cat-item" key={cat.id}>{cat.categoryName}</span>
                                )
                            )}
                        </p>
                        <div className="rating-cost">
                            <div className="restaurant-rating">
                                <FontAwesomeIcon icon="star"/> {restaurant.userRating}
                                <p className="sub-text">Average rating by <span
                                    className="bold">{restaurant.numberUsersRated}</span> users</p>
                            </div>
                            <div className="restaurant-avg-cost">
                                <FontAwesomeIcon icon="rupee-sign"/> {restaurant.avgPrice}
                                <p className="sub-text">Average cost for two people</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-container">
                    <div className="menu-container">
                        <div className="cat-container">
                            {categories.map((cat) => (
                            <div key={cat.id}>
                                <p className="cat-heading">{cat.categoryName}</p>
                                <Divider className="divider"/>
                                {cat.items.map((item) =>
                                    (
                                    <table key={item.id} className="menu-items">
                                        <tbody>
                                            <tr>    
                                                <td width="10%" className="veg-or-non-veg-icon">
                                                    <FontAwesomeIcon className={item.type} icon="circle" /> 
                                                </td>
                                                <td width="50%" className="menu-item-name">
                                                    {item.itemName}
                                                </td>
                                                <td width="30%">
                                                    <FontAwesomeIcon icon="rupee-sign"/> {(item.price).toFixed(2)}
                                                </td>
                                                <td>
                                                    <IconButton className={classes.button} onClick={() => this.addButtonClickHandler(item)} >
                                                        <Add className={classes.icon} />
                                                </IconButton>
                                                </td>
                                            </tr>
                                        </tbody>
                                </table>
                                    )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="cart-container">
                        <div className="cart-card-container">
                            <Card>
                                <div className="card-card-heading">
                                    <Badge className={classes.badge} badgeContent={this.state.cartCounter}
                                           color="primary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                    <span className="cart-heading">My Cart</span>
                            </div>
                            {cartItems.map((cartItem) => 
                                <table className="cart-table" width="100%">
                                        <tbody>
                                            <tr height='10px'>
                                                <td width="10%" className="veg-or-non-veg-icon">
                                                    <FontAwesomeIcon className={cartItem.type} icon={["far", "stop-circle"]} /> 
                                                </td>
                                                <td width="30%" className="menu-item-name">
                                                    {cartItem.itemName}
                                                </td>
                                                <td width="5%">
                                                    <IconButton onClick={() => this.removeButtonClickHandler(cartItem)}>
                                                        <Remove/>
                                                    </IconButton>
                                                </td>
                                                <td width="5%" className="cart-item-qty">
                                                    {cartItem.quantity}
                                                </td>
                                                <td width="5%">
                                                    <IconButton onClick={() => this.addButtonClickHandler(cartItem)}>
                                                        <Add/>
                                                    </IconButton>
                                                </td>
                                                <td width="40%" className="menu-item-amount">
                                                    <FontAwesomeIcon icon="rupee-sign"/> {(cartItem.cartPrice).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    )}
                                    <table className="cart-table" width="100%">
                                        <tbody>
                                            <tr>
                                                <td className="bold" width="70%">TOTAL AMOUNT</td>
                                                <td className="total-amount"><FontAwesomeIcon icon="rupee-sign"/> {(totalCartValue).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                <div className="cart-button">
                                    <Button variant="contained" color="primary" className="checkout-button"
                                            onClick={this.checkoutButtonClickHandler}>
                                        CHECKOUT
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                >
                    <SnackbarContent
                        onClose={this.handleClose}
                        message={this.state.snackBarMessage}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                className={classes.close}
                                onClick={this.handleClose}
                            >
                                <CloseIcon className={classes.icon}/>
                            </IconButton>,
                        ]}
                    />
                </Snackbar>
            </div>
        )
    }
}

export default withStyles(styles)(Details);
