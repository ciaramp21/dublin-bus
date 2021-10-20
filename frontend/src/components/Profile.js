import React from 'react';
import styles from './Map.module.css';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import {authFetch, logout} from "../auth";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            old_password: '',
            new_password: '',
            confirm_password: '',
            show_profile_alert: false,
            show_password_alert: false
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChangeProfile = this.onInputChangeProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        authFetch(
            process.env.REACT_APP_API_URL + '/user/'
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 200) {
                    data.json().then(result => {
                        this.setState({
                            profile: result
                        });
                    });
                }
            }
        }).catch(error => {
            console.error("error:", error);
        });
    }

    onInputChangeProfile(event) {
        const newProfile = this.state.profile;
        newProfile[event.target.name] = event.target.value;

        this.setState({
            profile: newProfile
        });
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    updateProfile(e) {
        e.preventDefault();
        authFetch(
            process.env.REACT_APP_API_URL + "/user/",
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.profile)
            }
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 200) {
                    this.setState({
                        show_profile_alert: true
                    });
                    setTimeout(() => {
                        this.setState({
                            show_profile_alert: false
                        });
                    }, 5000);
                }
            }
        }).catch(() => {
            this.setState({
                errors: ['request']
            });
        });
    }

    changePassword(e) {
        e.preventDefault();
        authFetch(
            process.env.REACT_APP_API_URL + "/user/password",
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    old_password: this.state.old_password,
                    new_password: this.state.new_password,
                    confirm_password: this.state.confirm_password,
                })
            }
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 200) {
                    this.setState(
                        {
                            old_password: '',
                            new_password: '',
                            confirm_password: ''
                        }
                    );
                    this.setState({
                        show_password_alert: true
                    });
                    setTimeout(() => {
                        this.setState({
                            show_password_alert: false
                        });
                    }, 5000);
                }
            }
        }).catch(() => {
            this.setState({
                errors: ['request']
            });
        });
    }

    deleteUser() {
        authFetch(
            process.env.REACT_APP_API_URL + "/user/",
            {
                method: "DELETE"
            }
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 204) {
                    logout();
                    this.props.setMenu("Home");
                }
            }
        }).catch(error => {
            console.error("error:", error);
        });
    }

    render() {
        if (this.state.profile === null) {
            return 'Loading...';
        }
        return (
            <div className={styles.profileContainer}>
                <Slide direction="up" in={this.props.display} mountOnEnter unmountOnExit>
                    <Paper elevation={3} className={styles.profilePaper}
                           style={{
                               overflowY: 'scroll',
                               backgroundColor: this.props.darkBackground,
                               color: this.props.darkText
                           }}>
                        <div style={{
                            maxWidth: '600px',
                            margin: 'auto',
                            paddingBottom: '24px'
                        }}>
                            <h1>Profile</h1>
                            {this.state.show_profile_alert &&
                            <Alert severity="success" style={{
                                marginBottom: '16px'
                            }}>You have successfully updated your profile!</Alert>}
                            <form onSubmit={this.updateProfile}>
                                <TextField
                                    label="First Name"
                                    name="firstname"
                                    value={this.state.profile.firstname || ''}
                                    type="text"
                                    style={{
                                        marginBottom: '16px',
                                        backgroundColor: this.props.darkForeground,
                                    }}
                                    variant="outlined"
                                    onChange={this.onInputChangeProfile}
                                    fullWidth
                                    inputProps={{style: {color: this.props.darkText}}}
                                    InputLabelProps={{
                                        style: {color: this.props.darkText},
                                    }}
                                    required
                                />
                                <TextField
                                    label="Last Name"
                                    name="lastname"
                                    value={this.state.profile.lastname || ''}
                                    type="text"
                                    style={{
                                        marginBottom: '16px',
                                        backgroundColor: this.props.darkForeground
                                    }}
                                    variant="outlined"
                                    onChange={this.onInputChangeProfile}
                                    fullWidth
                                    inputProps={{style: {color: this.props.darkText}}}
                                    InputLabelProps={{
                                        style: {color: this.props.darkText},
                                    }}
                                    required
                                />
                                <TextField
                                    label="Username"
                                    value={this.state.profile.username || ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        marginBottom: '16px',
                                        backgroundColor: this.props.darkForeground
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    inputProps={{style: {color: this.props.darkText}}}
                                    InputLabelProps={{
                                        style: {color: this.props.darkText},
                                    }}
                                    required
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={this.state.profile.email || ''}
                                    type="email"
                                    style={{
                                        marginBottom: '16px',
                                        backgroundColor: this.props.darkForeground
                                    }}
                                    variant="outlined"
                                    onChange={this.onInputChangeProfile}
                                    fullWidth
                                    inputProps={{style: {color: this.props.darkText}}}
                                    InputLabelProps={{
                                        style: {color: this.props.darkText},
                                    }}
                                    required
                                />
                                <FormControl
                                    variant="outlined"
                                    style={{
                                        marginBottom: '16px'
                                    }}
                                    fullWidth
                                >
                                    <InputLabel style={{color: this.props.darkText}}>Fare Type</InputLabel>
                                    <Select
                                        label="Fare Type"
                                        name="fare_type"
                                        value={this.state.profile.fare_type || ''}
                                        variant="outlined"
                                        style={{
                                            marginBottom: '16px',
                                            backgroundColor: this.props.darkForeground,
                                            color: this.props.darkText
                                        }}
                                        required
                                        onChange={this.onInputChangeProfile}
                                    >
                                        <MenuItem value="Adult">Adult</MenuItem>
                                        <MenuItem value="Child (Under 19)">Child (Under 19)</MenuItem>
                                        <MenuItem value="Child (Under 16)">Child (Under 16)</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button id="btnUpdateInfo" type="submit" variant="contained" color="primary"
                                        disabled={!this.state.profile.firstname || !this.state.profile.lastname
                                        || !this.state.profile.email || !this.state.profile.username}>
                                    Update Information</Button>
                            </form>
                            <h1 style={{
                                marginTop: '48px'
                            }}>Change password</h1>
                            {this.state.show_password_alert &&
                            <Alert severity="success" style={{
                                marginBottom: '16px'
                            }}>You have successfully updated your password!</Alert>}
                            <TextField
                                label="Current password"
                                name="old_password"
                                type="password"
                                variant="outlined"
                                style={{
                                    marginBottom: '16px',
                                    backgroundColor: this.props.darkForeground
                                }}
                                value={this.state.old_password}
                                onChange={this.onInputChange}
                                fullWidth
                                inputProps={{ style: {color: this.props.darkText} }}
                                InputLabelProps={{
                                  style: { color: this.props.darkText },
                                }}
                            />
                            <TextField
                                label="New password"
                                name="new_password"
                                type="password"
                                variant="outlined"
                                style={{
                                    marginBottom: '16px',
                                    backgroundColor: this.props.darkForeground
                                }}
                                value={this.state.new_password}
                                onChange={this.onInputChange}
                                fullWidth
                                helperText="Password must be at least 8 characters in length"
                                inputProps={{ style: {color: this.props.darkText} }}
                                InputLabelProps={{
                                  style: { color: this.props.darkText },
                                }}
                            />
                            <TextField
                                label="Confirm new password"
                                name="confirm_password"
                                type="password"
                                variant="outlined"
                                style={{
                                    marginBottom: '16px',
                                    backgroundColor: this.props.darkForeground
                                }}
                                value={this.state.confirm_password}
                                onChange={this.onInputChange}
                                fullWidth
                                inputProps={{ style: {color: this.props.darkText} }}
                                InputLabelProps={{
                                  style: { color: this.props.darkText },
                                }}
                            />
                            <Button id="btnChangePassword" variant="contained" color="primary"
                                    onClick={this.changePassword}
                                    disabled={!this.state.old_password || !this.state.new_password
                                    || !this.state.confirm_password || this.state.old_password.length < 8
                                    || this.state.new_password.length < 8 || this.state.confirm_password.length < 8
                                    || this.state.new_password !== this.state.confirm_password}
                            >Change Password</Button>
                            <h1 style={{
                                marginTop: '48px'
                            }}>Delete account</h1>
                            <div><Button id="btnDeleteAccount" variant="contained" color="secondary"
                                         onClick={() => { if (window.confirm('Are you sure you want to delete your account?')) this.deleteUser() } }>Delete My Account</Button>
                            </div>
                        </div>
                    </Paper>
                </Slide>
            </div>
        )
    }
}

export default Profile;