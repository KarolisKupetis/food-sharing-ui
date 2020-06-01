import React from 'react'
import {withGoogleMap, GoogleMap, withScriptjs, Marker} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import {UserLocationContext} from "../UserLocationContext";

Geocode.setApiKey("");
Geocode.enableDebug();

class Map extends React.Component {
    static contextType = UserLocationContext;

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            dynamic: this.props.dynamic ?? true
        }
    }

    /**
     * Get the current address from the default map position and set those values in the state
     */
    componentDidMount() {
        Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng).then(
            response => {
                this.setState({
                    address: '',
                })
            },
            error => {
                console.error(error);
            }
        );
    };

    /**
     * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
     *
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.mapPosition.lat !== this.state.mapPosition.lat;
    }

    /**
     * And function for city,state and address input
     * @param event
     */
    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    /**
     * When the marker is dragged you get the lat and long using the functions available from event object.
     * Use geocode to get the address, city, area and state from the lat and lng positions.
     * And then set those values in the state.
     *
     * @param event
     */

    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        this.props.onLatchange(newLat, newLng);
    };

    onPlaceSelected = (place) => {
        const latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

        // Set these values in the state.
        this.setState({
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        });

        this.props.onLatchange(latValue, lngValue);
    };

    getDynamic = () => {
        return (
            <div>
                <Autocomplete
                    style={{
                        width: '98%',
                        height: '40px',
                        paddingLeft: '16px',
                        marginTop: '2px',
                        marginBottom: '100px'
                    }}
                    onPlaceSelected={this.onPlaceSelected}
                    types={['address']}
                    componentRestrictions={{country: "lt"}}
                />

            </div>
        )
    };

    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap google={this.props.google}
                               defaultZoom={this.props.zoom}
                               defaultCenter={{lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
                    >
                        {this.state.dynamic && this.getDynamic()}

                        {/*Marker*/}
                        <Marker google={this.props.google}
                                name={'Dolores park'}
                                draggable={this.state.dynamic}
                                onDragEnd={this.onMarkerDragEnd}
                                position={{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
                        />

                    </GoogleMap>

                )
            )
        );

        let map;
        if (this.props.center.lat !== undefined) {
            map = <div>
                <AsyncMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=&libraries=places"
                    loadingElement={
                        <div style={{height: `100%`}}/>
                    }
                    containerElement={
                        <div style={{height: this.props.height}}/>
                    }
                    mapElement={
                        <div style={{height: `100%`}}/>
                    }
                />
            </div>
        } else {
            map = <div style={{height: this.props.height}}/>
        }
        return (map)
    }
}

export default Map