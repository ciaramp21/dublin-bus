import React from 'react';
import axios from "axios";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {login} from "../auth";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: []
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.submitLogIn = this.submitLogIn.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.validateForm = this.validateForm.bind(this);
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
        if (!this.state.username) {
            formErrors.push("username");
        }
        if (!this.state.password) {
            formErrors.push("password");
        }
        this.setState({
            errors: formErrors
        });
    }

    handleClose() {
        this.props.setLogin(false);
    }

    submitLogIn(e) {
        e.preventDefault();
        axios({
            method: 'POST',
            url: process.env.REACT_APP_API_URL + "/user/token/obtain",
            data: {
                username: this.state.username,
                password: this.state.password,
            }
        }, this.state).then(res => {
            if (res.status === 200) {
                login(res.data);
                this.handleClose();
            }
        }).catch(() => {
            this.setState({
                errors: ['request']
            });
        });
    }

    render() {
        return (
            <Dialog
                open={this.props.show}
                onClose={this.handleClose}
                fullWidth={true}
            >
                <DialogTitle>Login</DialogTitle>
                <form onSubmit={this.submitLogIn}>
                    <DialogContent>
                        {this.state.errors.includes("request") &&
                        <Alert severity="error" style={{marginBottom: '16px'}}>Error logging in - please check your
                            username and password!</Alert>}
                        <TextField
                            autoFocus
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
                            name="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            required
                            error={this.state.errors.includes("password")}
                            onChange={this.onInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                        <Button type="submit" onClick={this.validateForm} variant="contained" color="primary">
                            Login
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default LoginForm;