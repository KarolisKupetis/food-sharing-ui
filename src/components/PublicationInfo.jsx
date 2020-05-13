import React, {Component} from 'react';
import {CardMedia, Grid} from "@material-ui/core";
import Map from "./Map";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";

class PublicationInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            category: 'veg',
            file: '',
            latitude : 12,
            longitude : 12,
            imageLink: '',
            userName: '',
            number: '',
            loaded: false,
            redirect: false
        }
    }

     redirectToDash = () => {
        return <Redirect to="/publications"/>
    };

     redirectSet= () => {
        this.setState({redirect: true});
    };


    componentDidMount () {
        this.fetchData();
    }


     fetchData= async () => {
        const url = "http://localhost:8080/publication/"+this.props.match.params.id;
        const response = await fetch(url);
        const data = await response.json();

        this.setState(
            {
                title: data.name,
                description: data.description,
                category: 'veg',
                latitude : parseFloat(data.latitude),
                longitude : parseFloat(data.longitude),
                imageLink: data.imageLink,
                userName: data.user.fullName,
                number: data.user.number,
                loaded: true
            }
        );
    };

     getRender = () => {
            return (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} >
                        <Map
                            google={this.props.google}
                            center={{lat: this.state.latitude, lng: this.state.longitude}}
                            height='300px'
                            zoom={14}
                            dynamic = {false}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <TextField
                            placeholder="Skelbimo pavadinimas"
                            label="Pavadinimas"
                            margin="normal"
                            fullWidth={true}
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
                            value={this.state.description}
                        />
                        <TextField
                            label="Kategorija"
                            placeholder="Kategorija"
                            fullWidth={true}
                            margin="normal"
                            name="category"
                            value={"Vegetariska"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        {this.state.imageLink && <CardMedia style={{ height: "300px", width: "400px"}} image={this.state.imageLink} />}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            label="Skelbėjo vardas"
                            placeholder="skelbejas"
                            fullWidth={true}
                            margin="normal"
                            name="user"
                            value={this.state.userName}
                        />
                        <TextField
                            placeholder="Numeris"
                            label="Telefono numeris"
                            margin="normal"
                            fullWidth={true}
                            value={this.state.number ?? 'Nepateikta'}
                            name="title"
                        />
                        <Button color="primary" variant="contained" onClick={this.redirectSet}>Grįžti į pradinį puslapį</Button>
                    </Grid>
                </Grid>
            )
    };

    render() {
        if (this.state.redirect) {
            return this.redirectToDash();
        }

        if (this.state.loaded) {
            return this.getRender();
        }

        return <div>Loading</div>;
    }
}

export default PublicationInfo;