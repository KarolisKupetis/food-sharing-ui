import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import MenuItem from '@material-ui/core/MenuItem';
import {CardMedia} from "@material-ui/core";
import Map from "../Map";
import {Grid} from "@material-ui/core";
import {Redirect} from "react-router-dom";
import {UserLocationContext} from "../../UserLocationContext";
import Swal from 'sweetalert2'

const types = [
    {
        value: 'vegetable',
        label: 'Daržovės',
    },
    {
        value: 'fruit',
        label: 'Vaisiai',
    },
    {
        value: 'veg',
        label: 'Vegetariški',
    },
    {
        value: 'full',
        label: 'Paruostas patiekalas',
    },
    {
        value: 'ingredient',
        label: 'Maisto produktas',
    },
];

interface FormPublicationProps {
    title: string;
    description: string;
    category: 'vegetable'|'fruit'|'veg'|'full'|'ingredient';
    file?: File;
    latitude: number;
    longitude: number;
    loaded: boolean;
    google: object;
    image?: string;
}

class FormPublication extends Component<{} , FormPublicationProps> {
    static contextType = UserLocationContext;

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            category: 'veg',
            file: null,
            latitude: 54.705316192588626,
            longitude: 25.303910311889645,
            loaded: false,
            google: props.google,
            image: null
        }
    }

    onImageUpload = (event) => {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    onChange = (event) => {
        const {name, value} = event.target;
        if (name === 'description') {
            this.setState({description: value});
        } else if (name === 'title') {
            this.setState({title: value});
        } else if (name === 'category') {
            this.setState({category: value});
        }
    };

    onLatLonChange = (lat, lng) => {
        this.setState({latitude: lat, longitude: lng});
    };

    onClickHandler = () => {
        this.onSubmit();
    };

    resetState = () => {
        this.setState({
            title: '',
            description: '',
            category: 'veg',
            file: null,
            image: '',
        })
    };

    onSubmit = async () => {
        const formData = new FormData();
        for (let name in this.state) {
            if (name === 'file') {
                formData.append('image', this.state[name]);
            } else if (name != "loaded" && name != "google") {
                formData.append(name, this.state[name]);
            }
        }

        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            body: formData
        };
            //requestOptions
        const response = await fetch('http://localhost:8080/publication', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.status == 201) {
            Swal.fire({
                icon: 'success',
                text: "Sėkmingai sukurtas įrašas"
            });
            this.resetState();
        } else {
            Swal.fire({
                icon: 'error',
                text: "Neteisingi duomenys"
            });
        }

    };

    initialLocationChange = () => {
        this.setState({latitude: this.context.location.lat, longitude: this.context.location.lng, loaded: true})
    };

    getRender = () => {
        return (
            <div>
                <AppBar title="Enter User Details"/>
                <TextField
                    placeholder="Skelbimo pavadinimas"
                    label="Pavadinimas"
                    margin="normal"
                    fullWidth={true}
                    onChange={this.onChange}
                    value={this.state.title}
                    name="title"
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Apibrezimas"
                    multiline
                    rows={2}
                    placeholder="Apibrėžimas"
                    fullWidth={true}
                    margin="normal"
                    name="description"
                    onChange={this.onChange}
                    value={this.state.description}
                />
                <TextField
                    id="filled-select-currency"
                    select
                    label="Kategorija"
                    defaultValue={"veg"}
                    helperText="Pasirinkite maisto kategorija"
                    variant="standard"
                    name="category"
                    fullWidth={true}
                    onChange={this.onChange}
                    value={this.state.category}
                >
                    {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button color="primary" variant="contained" onClick={this.onClickHandler}>Paskelbti</Button>
                <input accept="image/*" style={{display: 'none'}} id="raised-button-file" multiple type="file"
                       onChange={this.onImageUpload}/>
                <label htmlFor="raised-button-file">
                    <Button variant="contained" color="primary" component="span" style={{margin: "10px"}}>
                        Ikelti paveiksleli
                    </Button>
                </label>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={8}>
                        <Map
                            google={this.state.google}
                            center={{lat: this.state.latitude, lng: this.state.longitude}}
                            height='300px'
                            zoom={14}
                            onLatchange={this.onLatLonChange}
                            dynamic={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {this.state.image &&
                        <CardMedia style={{height: "300px", width: "300px"}} image={this.state.image}/>}
                    </Grid>
                </Grid>
            </div>
        )
    };

    render() {
        function redirectToDash() {
            return <Redirect to='/publications'/>
        }

        if (!this.state.loaded) {
            this.initialLocationChange();
        }

        return (
            this.state.loaded ? this.getRender() : <div>Loading</div>
        )
    }
}

export default FormPublication;