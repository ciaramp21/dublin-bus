import React from 'react';
import axios from "axios";
import {PrivacyPolicy} from "./PrivacyPolicy.js";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from "@material-ui/lab/Alert";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class UserRegister extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showHidePolicy: false,
            privacyCheckbox: false,
            ageCheckbox: false,
            isOpen: false,
            errors: [],
            first_name: null,
            last_name: null,
            fare_type: 'Adult',
            username: null,
            email: null,
            password: null,
            confirm_password: null
        };

        this.hideComponent = this.hideComponent.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange = () => {
        this.setState({privacyCheckbox: !this.state.privacyCheckbox});

    };

    handleAgeChange = () => {
        this.setState({ageCheckbox: !this.state.ageCheckbox});
    }

    hideComponent() {
        this.setState({showHidePolicy: !this.state.showHidePolicy});
        this.setState({isOpen: !this.state.isOpen});
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            errors: this.state.errors.filter(e => {
                return e !== event.target.name;
            })
        });

    }

    validateForm() {
        let formErrors = [];
        if (!this.state.first_name) {
            formErrors.push("first_name");
        }
        if (!this.state.last_name) {
            formErrors.push("last_name");
        }
        if (!this.state.username) {
            formErrors.push("username");
        }
        if (!this.state.email) {
            formErrors.push("email");
        }
        if (!this.state.password) {
            formErrors.push("password");
        }
        this.setState({
            errors: formErrors
        });
    }

    handleClose() {
        this.props.setRegister(false);
        this.setState({privacyCheckbox: false});
        this.setState({ageCheckbox: false});
        this.setState({errors: []});
    }

    submitRegister(e) {
        e.preventDefault();
        axios({
            method: 'POST',
            url: process.env.REACT_APP_API_URL + "/user/",
            data: {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                fare_type: this.state.fare_type,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
        }, this.state).then(data => {
            if (data) {
                if (data.status === 201) {
                    this.handleClose();
                    this.props.setLogin(true);
                } else if (data.status === 400) {
                    data.json().then(result => {
                        if (result.password) {
                            console.log('Password');
                        }
                    });
                }
            }
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 400) {
                    if (error.response.data && error.response.data.password) {
                        this.setState({
                            errors: ['password']
                        });
                    }
                    if (error.response.data && error.response.data.username) {
                        this.setState({
                            errors: ['username']
                        });
                    }
                } else {
                    this.setState({
                        errors: ['request']
                    });
                }
            } else {
                this.setState({
                    errors: ['request']
                });
            }
        })
    }

    render() {
        const {showHidePolicy} = this.state;
        let buttonText = this.state.isOpen ? "Close" : "View Privacy Statement";
        return (
            <Dialog
                open={this.props.show}
                onClose={this.handleClose}
            >
                <DialogTitle style={{paddingBottom: '0'}}>Register</DialogTitle>
                <form onSubmit={this.submitRegister}>
                    <DialogContent>
                        {this.state.errors.includes("request") &&
                        <Alert severity="error" style={{marginBottom: '16px'}}>Error registering - please check all your
                            information is correct!</Alert>}
                        {this.state.errors.includes("username") &&
                        <Alert severity="error" style={{marginBottom: '16px'}}>Error registering - username already
                            exists!</Alert>}
                        {this.state.errors.includes("password") &&
                        <Alert severity="error" style={{marginBottom: '16px'}}>Error registering - password must be at
                            least 8 characters in length</Alert>}
                        <TextField
                            autoFocus
                            name="first_name"
                            label="First Name"
                            type="text"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("first_name")}
                            onChange={this.onInputChange}
                        />
                        <TextField
                            name="last_name"
                            label="Last Name"
                            type="text"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("last_name")}
                            onChange={this.onInputChange}
                        />
                        <FormControl
                            variant="outlined"
                            style={{
                                marginBottom: '16px'
                            }}
                            fullWidth
                        >
                            <InputLabel>Fare Type *</InputLabel>
                            <Select
                                variant="outlined"
                                name="fare_type"
                                label="Fare Type"
                                value={this.state.fare_type}
                                required
                                onChange={this.onInputChange}
                            >
                                <MenuItem value="Adult">Adult</MenuItem>
                                <MenuItem value="Child (Under 19)">Child (Under 19)</MenuItem>
                                <MenuItem value="Child (Under 16)">Child (Under 16)</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="username"
                            label="Username"
                            type="text"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("username")}
                            onChange={this.onInputChange}
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("email")}
                            onChange={this.onInputChange}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            helperText="Password must be at least 8 characters in length"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("password")}
                            InputProps={{inputProps: {min: 8}}}
                            onChange={this.onInputChange}
                        />
                        <TextField
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            style={{
                                marginBottom: '16px'
                            }}
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("confirm_password")}
                            InputProps={{inputProps: {min: 8}}}
                            onChange={this.onInputChange}
                        />

                        <div><input onChange={this.handleAgeChange} type="checkbox" id="ageconsent" name="ageconsent"
                                    value="ageconsent"/>
                            <label htmlFor="ageconsent"> Please tick to confirm you are 16 years or older.</label></div>

                        <div><input onChange={this.handleChange} type="checkbox" id="privacypolicy" name="privacypolicy"
                                    value="privacypolicy"/>
                            <label htmlFor="privacypolicy"> Please tick to confirm you have read and accept our privacy
                                agreement.</label></div>
                        {showHidePolicy && <PrivacyPolicy/>}
                        <div style={{textAlign: 'center'}}>
                            <Button
                                variant="text"
                                color="primary"
                                id="privacyButton" onClick={() => this.hideComponent()}
                                value="Click to view our Privacy Statement">
                                {buttonText}
                            </Button>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                        <Button id='register' type="submit" onClick={this.validateForm} variant="contained"
                                color="primary"
                                disabled={!this.state.first_name || !this.state.last_name || !this.state.email
                                || !this.state.username || !this.state.privacyCheckbox || !this.state.ageCheckbox
                                || !this.state.password || !this.state.confirm_password
                                || this.state.password !== this.state.confirm_password}>
                            Register
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default UserRegister;