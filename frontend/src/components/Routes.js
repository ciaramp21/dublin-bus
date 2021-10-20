import React from 'react';
import axios from 'axios';
import styles from './Map.module.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

class Routes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            routes: [],
            directions: [],
            boardingStops: [],
            alightingStops: [],
            route: "",
            direction: "",
            boardingStop: "",
            alightingStop: ""
        }

        this.selectRoute = this.selectRoute.bind(this)
        this.selectDirection = this.selectDirection.bind(this)
        this.selectBoarding = this.selectBoarding.bind(this)
        this.selectAlighting = this.selectAlighting.bind(this)
    }

    async componentDidMount() {
        const fetchData = async () => {
            const result = await axios(process.env.REACT_APP_API_URL + '/bus/routes');
            this.setState({
                routes: result.data.routes
            });
        };
        if (this.state.routes.length === 0) {
            await fetchData();
        }
    }

    async selectRoute(e) {
        const {value} = e.target;
        this.props.setRoute(value);
        await this.setState({
            route: value,
            direction: "",
            directions: [],
            boardingStop: "",
            alightingStop: ""
        });
        const result = await axios(process.env.REACT_APP_API_URL + '/bus/routes/' + value + '/directions');
        this.setState({
            directions: result.data.directions
        });
    }

    async selectDirection(e) {
        const {value} = e.target;
        this.props.setDirection(value);
        await this.setState({
            direction: value,
            boardingStop: "",
            boardingStops: [],
            alightingStop: ""
        });
        const result = await axios(process.env.REACT_APP_API_URL + '/bus/routes/' + this.state.route + '/directions/' + value + '/boarding');
        this.setState({
            boardingStops: result.data.boarding
        });
    }

    async selectBoarding(e) {
        const {value} = e.target;
        this.props.setBoarding(value);
        await this.setState({
            boardingStop: value,
            alightingStop: "",
            alightingStops: []
        });
        const result = await axios(process.env.REACT_APP_API_URL + '/bus/routes/' + this.state.route + '/directions/' + this.state.direction + '/boarding/' + value + '/alighting');
        this.setState({
            alightingStops: result.data.alighting
        });
    }

    async selectAlighting(e) {
        const {value} = e.target;
        this.props.setAlighting(value);
        await this.setState({
            alightingStop: value,
        });
    }

    render() {
        if (this.state.routes.length === 0) {
            return (<React.Fragment>
                <CircularProgress/>
                <div style={{color: this.props.darkText, marginTop: '8px'}}>Retrieving routes...</div>
            </React.Fragment>);
        } else {
            return (
                <React.Fragment>
                    <Grid container spacing={1}>
                        {this.state.routes.length > 0 && <Grid item xs={12} md={6} id="route">
                            <Paper className={styles.routeDropdownContainer}
                                   style={{backgroundColor: this.props.darkForeground}}>
                                <FormHelperText style={{color: this.props.darkText, marginBottom: '8px'}}>1. Select a
                                    Route</FormHelperText>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="dropdown1" style={{color: this.props.darkText}}>Route</InputLabel>
                                    <Select
                                        style={{color: this.props.darkText}}
                                        labelId="dropdown1"
                                        id="dropdown1"
                                        label="Route"
                                        value={this.state.route}
                                        onChange={this.selectRoute}
                                    >
                                        {this.state.routes.map(route => (
                                            <MenuItem key={route.routename}
                                                      value={route.routename}>{route.routename}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>}
                        {this.state.route && (
                            <Grid item xs={12} md={6} id="direction">
                                <Paper className={styles.routeDropdownContainer}
                                       style={{backgroundColor: this.props.darkForeground}}>
                                    {this.state.directions.length > 0 ?
                                        <div>
                                            <FormHelperText style={{color: this.props.darkText, marginBottom: '8px'}}>2.
                                                Select a
                                                Direction</FormHelperText>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel id="dropdown2"
                                                            style={{color: this.props.darkText}}>Direction</InputLabel>
                                                <Select
                                                    style={{color: this.props.darkText}}
                                                    labelId="dropdown2"
                                                    id="dropdown2"
                                                    label="Direction"
                                                    value={this.state.direction}
                                                    onChange={this.selectDirection}
                                                >
                                                    {this.state.directions.map(direction => (
                                                        <MenuItem key={direction.direction}
                                                                  value={direction.direction}>{direction.routedescription + " " + direction.direction}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        :
                                        <div style={{padding: '15px 0'}}>
                                            <CircularProgress size={33}/>
                                            <div>
                                                <small style={{color: this.props.darkText, marginTop: '8px'}}>
                                                    Retrieving directions...
                                                </small>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>)}
                        {this.state.direction && <Grid item xs={12} md={6} id="boarding">
                            <Paper className={styles.routeDropdownContainer}
                                   style={{backgroundColor: this.props.darkForeground}}>
                                {this.state.boardingStops.length > 0 ?
                                    <div>
                                        <FormHelperText style={{color: this.props.darkText, marginBottom: '8px'}}>3.
                                            Select a Boarding
                                            Stop</FormHelperText>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="dropdown3" style={{color: this.props.darkText}}>Boarding
                                                Stop</InputLabel>
                                            <Select
                                                style={{color: this.props.darkText}}
                                                labelId="dropdown3"
                                                id="dropdown3"
                                                label="Boarding Stop"
                                                value={this.state.boardingStop}
                                                onChange={this.selectBoarding}>
                                                {this.state.boardingStops.map(boarding => (
                                                    <MenuItem key={boarding.id}
                                                              value={boarding.platecode}>{boarding.shortcommonname_en + " Bus Stop: " + boarding.platecode}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    :
                                    <div style={{padding: '15px 0'}}>
                                        <CircularProgress size={33}/>
                                        <div>
                                            <small style={{color: this.props.darkText, marginTop: '8px'}}>
                                                Retrieving boarding stops...
                                            </small>
                                        </div>
                                    </div>
                                }
                            </Paper>
                        </Grid>}
                        {this.state.boardingStop && <Grid item xs={12} md={6} id="alighting">
                            <Paper className={styles.routeDropdownContainer}
                                   style={{backgroundColor: this.props.darkForeground}}>
                                {this.state.alightingStops.length > 0 ?
                                    <div>
                                        <FormHelperText style={{color: this.props.darkText, marginBottom: '8px'}}>4.
                                            Select an Alighting
                                            Stop</FormHelperText>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="dropdown4"
                                                        style={{color: this.props.darkText, marginBottom: '8px'}}>Alighting
                                                Stop</InputLabel>
                                            <Select
                                                style={{color: this.props.darkText}}
                                                labelId="dropdown4"
                                                id="dropdown4"
                                                label="Alighting Stop"
                                                fullWidth
                                                value={this.state.alightingStop}
                                                onChange={this.selectAlighting}>
                                                {this.state.alightingStops.map(alighting => (
                                                    <MenuItem key={alighting.id}
                                                              value={alighting.platecode}>{alighting.shortcommonname_en + " Bus Stop: " + alighting.platecode}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    :
                                    <div style={{padding: '15px 0'}}>
                                        <CircularProgress size={33}/>
                                        <div>
                                            <small style={{color: this.props.darkText, marginTop: '8px'}}>
                                                Retrieving alighting stops...
                                            </small>
                                        </div>
                                    </div>
                                }
                            </Paper>
                        </Grid>}
                    </Grid>
                </React.Fragment>
            )
        }
    }
}

export default Routes;