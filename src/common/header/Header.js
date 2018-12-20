import React, {Component} from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Fastfood from '@material-ui/icons/Fastfood';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import Toc from '@material-ui/icons/Toc';
import Grid from "@material-ui/core/Grid/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Menu from "@material-ui/core/Menu/Menu";
import Popover from "@material-ui/core/Popover/Popover";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{padding: 0, textAlign: 'center', width: 'parent'}}>
            {props.children}
        </Typography>
    )
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

let baseUrl = "http://localhost:8080/api";

class Header extends Component {


    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            value: 0,
            anchorEl: null,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            isEmailValid: "dispNone",
            isPassValid: "dispNone",
            isContactValid: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            registrationSuccess: false,
            formValid: false,
            loggedInUserName: '',
            isLoggedInContactValid: "dispNone",
            successMessage: "",
            errorResponse: "",
            showUserProfileDropDown: false,
            enableMyAccount: false,
            loggedIn: sessionStorage.getItem("access-token") != null
        }
    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            usernameRequired: "dispNone",
            isLoggedInContactValid: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            isEmailValid: "dispNone",
            isPassValid: "dispNone",
            isContactValid: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            openSnackBar: false,
            errorResponse: "",
            successMessage: ""
        });
    };

    closeModalHandler = () => {
        this.setState({modalIsOpen: false});
    };

    tabChangeHandler = (event, value) => {
        this.setState({value});
    };

    loginClickHandler = () => {
        const loginPath = "/user/login";
        const contactRegx = /^[0-9]{10}$/;
        this.state.username === "" ? this.setState({
                usernameRequired: "dispBlock",
                isLoggedInContactValid: "dispNone",
            }) :
            this.state.username.match(contactRegx) ? this.setState({
                    usernameRequired: "dispNone",
                    isLoggedInContactValid: "dispNone",
                }) :
                this.setState({usernameRequired: "dispNone", isLoggedInContactValid: "dispBlock",});

        this.state.loginPassword === "" ? this.setState({loginPasswordRequired: "dispBlock"}) : this.setState({loginPasswordRequired: "dispNone"});

        if (this.state.username === "" || this.state.loginPassword === "") {
            return;
        }
        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 200) {
                let user = JSON.parse(this.responseText);


                that.setState({
                    loggedIn: true,
                    loggedInUserName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    openSnackBar: true,
                    successMessage: 'Logged in successfully!'

                });
                sessionStorage.setItem("uuid", user.id);
                sessionStorage.setItem("loggedInUserName", user.firstName);
                sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                that.closeModalHandler();
            } else {
                that.setState({errorResponse: this.responseText});
            }
        });
        let data = "contactNumber=" + this.state.username + "&password=" + this.state.loginPassword;
        xhrLogin.open("POST", baseUrl + loginPath + "?" + data);
        //xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.loginPassword));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);
    };

    inputUsernameChangeHandler = (e) => {
        this.setState({username: e.target.value});
    };

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({loginPassword: e.target.value});
    };

    /**
     * validate the sign up page
     * */
    validateSignUp() {

        const emailRegx = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        const passwordRegx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const contactRegx = /^[0-9]{10}$/;


        this.state.firstname === "" ? this.setState({
            firstnameRequired: "dispBlock",
            formValid: false
        }) : this.setState({
            firstnameRequired: "dispNone",
            formValid: true
        });
        // this.state.lastname === "" ? this.setState({lastnameRequired: "dispBlock"}) : this.setState({lastnameRequired: "dispNone"});
        this.state.email === "" ? this.setState({
            emailRequired: "dispBlock",
            isEmailValid: "dispNone",
            formValid: false
        }) : this.state.email.match(emailRegx) ? this.setState({
            isEmailValid: "dispNone",
            emailRequired: "dispNone",
            formValid: true
        }) : this.setState({isEmailValid: "dispBlock", emailRequired: "dispNone", formValid: false});

        this.state.registerPassword === "" ? this.setState({
                registerPasswordRequired: "dispBlock",
                isPassValid: "dispNone",
                formValid: false
            }) :
            this.state.registerPassword.match(passwordRegx) ? this.setState({
                isPassValid: "dispNone",
                registerPasswordRequired: "dispNone",
                formValid: true
            }) : this.setState({
                isPassValid: "dispBlock",
                registerPasswordRequired: "dispNone",
                formValid: false
            });

        this.state.contact === "" ? this.setState({
                contactRequired: "dispBlock",
                isContactValid: "dispNone",
                formValid: false
            }) :
            this.state.contact.match(contactRegx) ? this.setState({
                isContactValid: "dispNone",
                contactRequired: "dispNone",
                formValid: true
            }) : this.setState({
                isContactValid: "dispBlock",
                contactRequired: "dispNone",
                formValid: false
            });


        return this.state.formValid;
    }

    /**
     * user sign up api call
     */
    signUp(dataSignup) {

        let resourcePath = "/user/signup";
        let xhrSignup = new XMLHttpRequest();
        let that = this;

        console.log("baseurl : " + baseUrl + resourcePath);
        console.log("signUp Data : " + dataSignup);
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 201) {
                that.setState({
                    registrationSuccess: true,
                    openSnackBar: true,
                    value: 0,
                    errorResponse: this.responseText,
                    successMessage: 'Registered successfully! Please login now!'
                });
            } else {
                that.setState({errorResponse: this.responseText});
                console.log(this.responseText);
            }
        });

        xhrSignup.open("POST", baseUrl + resourcePath + "?" + dataSignup.toString());
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send();

    }

    /**
     * singup click handler to call the sign up method
     * */
    signUpClickHandler = () => {

        if (this.validateSignUp()) {

            let dataSignup =
                "firstName=" + this.state.firstname +
                "&lastName=" + this.state.lastname +
                "&email=" + this.state.email +
                "&contactNumber=" + this.state.contact +
                "&password=" + this.state.registerPassword
            ;
            this.signUp(dataSignup);

        } else {
            console.log("validation fail............")
        }

    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({openSnackBar: false});
    };

    inputFirstNameChangeHandler = (e) => {
        this.setState({firstname: e.target.value});
    };

    inputLastNameChangeHandler = (e) => {
        this.setState({lastname: e.target.value});
    };

    inputEmailChangeHandler = (e) => {
        this.setState({email: e.target.value});
    };

    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({registerPassword: e.target.value});
    };

    inputContactChangeHandler = (e) => {
        this.setState({contact: e.target.value});
    };

    handleCloseMenu = () => {


        this.setState({showUserProfileDropDown: false, anchorEl: null});
    };

    profileClickHandler = () => {
        this.props.history.push({
            pathname: "/profile"
        });
    };
    /**
     * this is method is logout the user from current session and navigates him to home page
     *
     */
    logoutClickHandler = () => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("loggedInUserName");
        sessionStorage.removeItem("access-token");
        this.setState({
            loggedIn: false,
            showUserProfileDropDown: false
        });
        this.props.history.push({
            pathname: "/"
        });
    };

    /**
     * Event handler called when the profile menu icon inside the header is clicked to toggle the user profile dropdown
     * @memberof Header
     */
    profileIconClickHandler = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            showUserProfileDropDown: !this.state.showUserProfileDropDown
        });
    };

    render() {
        const renderMenu = (
            <Menu
                id="menu-list-grow"
                open={this.state.showUserProfileDropDown}
                anchorEl={this.state.anchorEl}
                onClose={this.handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}

                getContentAnchorEl={null}
            >

                <MenuItem onClick={this.profileClickHandler}>Profile</MenuItem>
                <MenuItem onClick={this.logoutClickHandler}>Logout</MenuItem>
            </Menu>
        );
        return (
            <div>
                <header className="app-header">
                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                        <Grid item lg={3} xs={12}>
                            <IconButton color="inherit" aria-label="Open drawer">
                                <Fastfood/>
                            </IconButton>
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            <div className="searchIcon">
                                <SearchIcon/>
                            </div>
                            <Input className="inputInput"
                                   placeholder="Search by Restaurant Name"
                                   onChange={this.props.onChange}
                            />
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            <IconButton color="inherit" aria-label="Open drawer">
                                <Toc/> Categories
                            </IconButton>
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            {!this.state.loggedIn ?
                                <div className="login-button">

                                    <Button variant="contained" color="default" onClick={this.openModalHandler}>
                                        <AccountCircle className="account-circle"/>
                                        Login
                                    </Button>
                                </div>
                                :
                                <div>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        aria-owns={this.state.showUserProfileDropDown ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.profileIconClickHandler}>

                                        <AccountCircle className="account-circle"/>
                                        {sessionStorage.getItem('loggedInUserName')}

                                    </Button>
                                    {renderMenu}

                                </div>
                            }
                        </Grid>
                    </Grid>
                </header>
                {/*modal for login and sign up*/}
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="LOGIN"/>
                        <Tab label="SIGNUP"/>
                    </Tabs>
                    {/*signin page detail*/}
                    {this.state.value === 0 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="username">Contact No.</InputLabel>
                            <Input id="username" type="number" username={this.state.username}
                                   onChange={this.inputUsernameChangeHandler}/>
                            <FormHelperText className={this.state.usernameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.isLoggedInContactValid}>
                                <span className="red">Invalid Contact</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword}
                                   onChange={this.inputLoginPasswordChangeHandler}/>
                            <FormHelperText className={this.state.loginPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        {this.state.loggedIn === true ?
                            <FormControl>
        <span className="successText">
            Login Successful!
        </span>
                            </FormControl>
                            :
                            <FormControl>
        <span className="red">
            {this.state.errorResponse}
        </span>
                            </FormControl>
                        }
                        <br/><br/>
                        <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                    </TabContainer>
                    }
                    {/*signup  page ...................*/}
                    {this.state.value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" firstname={this.state.firstname}
                                   onChange={this.inputFirstNameChangeHandler}/>
                            <FormHelperText className={this.state.firstnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" lastname={this.state.lastname}
                                   onChange={this.inputLastNameChangeHandler}/>
                            <FormHelperText className={this.state.lastnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" email={this.state.email}
                                   onChange={this.inputEmailChangeHandler}/>
                            <FormHelperText className={this.state.emailRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.isEmailValid}>
                                <span className="red">Invalid Email</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" type="password" registerpassword={this.state.registerPassword}
                                   onChange={this.inputRegisterPasswordChangeHandler}/>
                            <FormHelperText className={this.state.registerPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.isPassValid}>
        <span className="red">Password must contain at least one capital letter, one small letter,
            one number, and one special character</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="text" contact={this.state.contact}
                                   onChange={this.inputContactChangeHandler}/>
                            <FormHelperText className={this.state.contactRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.isContactValid}>
        <span
            className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        {this.state.registrationSuccess === true ?
                            <div>
                                <FormHelperText>
                                    <span>{this.state.errorResponse}</span>
                                </FormHelperText>
                            </div>
                            :
                            <div>
                                <FormHelperText>
                                    <span className="red">{this.state.errorResponse}</span>
                                </FormHelperText>
                            </div>
                        }
                        <br/><br/>
                        <Button variant="contained" color="primary"
                                onClick={this.signUpClickHandler}>SIGNUP</Button>
                    </TabContainer>
                    }
                </Modal>
                {/*notification snack bar */}
                <div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.openSnackBar}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.successMessage}</span>}
                    />
                </div>
            </div>
        )
    }
}

export default Header;