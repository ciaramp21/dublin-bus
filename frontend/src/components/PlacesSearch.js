import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {StandaloneSearchBox} from '@react-google-maps/api';
import TextField from '@material-ui/core/TextField';

export function PlacesSearch({
                                 onPlacesChanged,
                                 onPlacesLoad,
                                 place,
                                 search,
                                 label,
                                 darkBackground,
                                 darkForeground,
                                 darkText,
                                 style,
                                 error
                             }) {
// Implement bias for Dublin. Right now it has no bias for autocomplete, so it gives locations all around the world.
    const useStyles = makeStyles((theme) => ({
        standaloneSearchBox: {
            flex: 1,
            position: "absolute",
            width: "100%",
            margin: "auto",
            height: "auto",
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            <StandaloneSearchBox
                className={classes.standaloneSearchBox}
                onLoad={onPlacesLoad}
                onPlacesChanged={
                    onPlacesChanged
                }
                // Bounds creates autocomplete bias for places search within given area
                bounds={{
                    north: 54.345804,
                    south: 52.345804,
                    east: -5.26031,
                    west: -7.26031,
                }}
                options={{types: ['address']}}
                style={{top: "auto !important"}}
            >
                {/* Input text box for searching places */}
                <TextField
                    className={classes.input}
                    placeholder={place ? place : search}
                    inputProps={{'aria-label': 'search google maps', style: {color: darkText}}}
                    error={error}
                    label={error ? error : label}
                    style={style}
                    type="search"
                    variant="outlined"
                    fullWidth
                    inputProps={{ style: {color: darkText} }}
                    InputLabelProps={{
                      style: { color: darkText },
                    }}
                />
            </StandaloneSearchBox>
        </React.Fragment>
    )
}