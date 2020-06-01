import React, {Component} from 'react';
import {CardMedia, Grid, Modal} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Map from "./components/Map";
import Backdrop from '@material-ui/core/Backdrop';
import MenuItem from "@material-ui/core/MenuItem";
import Swal from "sweetalert2";

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

interface publicationModalProps {
    publication: object,
    modalSet: (flag: boolean) => void;
    getStyles: (styleName: string) => string;
}

interface publicationInfo {
    title: string;
    description: string;
    category: string;
    file?: File;
    latitude: number;
    longitude: number;
    imageLink?: URL;
    loaded: boolean;
    redirect: boolean;
    publication: {id: number, imageLink: string};
    modalSet: (flag: boolean) => void;
    styles: (styleName: string) => string;
    google: object;
    image?: string;
}

class PublicationModal extends Component<publicationModalProps, publicationInfo> {

    constructor(props) {
        super(props);

        this.state = {
            title: props.publication.name,
            description: props.publication.description,
            category: props.publication.category,
            file: null,
            latitude: parseFloat(props.publication.latitude),
            longitude: parseFloat(props.publication.longitude),
            imageLink: props.publication.imageLink,
            loaded: false,
            redirect: false,
            publication: props.publication,
            modalSet: props.modalSet,
            styles: props.getStyles,
            google: props.google,
            image: ''
        }
    }

    onSubmit = async () => {
        const formData = new FormData();

        for (let name in this.state) {
            if (name === 'file') {
                formData.append('image', this.state[name]);
            } else if (name !== "loaded"
                && name !== "redirect"
                && name !== "publicaton"
                && name !== "modalSet"
                && name !== "styles"
                && name !== "google"
            )
            {
                formData.append(name, this.state[name]);
            }
        }

        const response = await fetch('http://localhost:8080/publication/' + this.state.publication.id, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });

        if (response.status == 200) {
            Swal.fire({
                icon: 'success',
                text: 'Sėkmingai atnaujintas įrašas',
            });

            this.closeModal();
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Neteisingi duomenys',
            });
        }
    };

    closeModal = () => {
        this.state.modalSet(false)
    };

    getStyle = (style) => {
        return this.state.styles(style)
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

    onImageUpload = (event) => {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    onLatLonChange = (lat, lng) => {
        this.setState({latitude: lat, longitude: lng});
    };

    render() {
        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={
                        {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }
                    }
                    open={true}
                    onClose={this.closeModal}
                    closeAfterTransition
                    className={this.getStyle('modal')}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={true}>
                        <div>
                            <div id="transition-modal-title" className={this.getStyle('paper')}>
                                <AppBar title="Enter User Details"/>
                                <TextField
                                    placeholder="Skelbimo pavadinimas"
                                    label="Pavadinimas"
                                    margin="normal"
                                    fullWidth={true}
                                    value={this.state.title}
                                    name="title"
                                    onChange={this.onChange}
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
                                    onChange={this.onChange}
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
                                <Button color="primary" variant="contained" onClick={this.onSubmit}>Atnaujinti</Button>
                                <input accept="image/*" style={{display: 'none'}} id="raised-button-file" multiple
                                       type="file" onChange={this.onImageUpload}/>
                                <label htmlFor="raised-button-file">
                                    <Button variant="contained" color="primary" component="span"
                                            style={{margin: "10px"}}>
                                        Ikelti paveiksleli
                                    </Button>
                                </label>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        <Map
                                            google={this.state.google}
                                            center={{lat: this.state.latitude, lng: this.state.longitude}}
                                            height='200px'
                                            zoom={14}
                                            onLatchange={this.onLatLonChange}
                                            dynamic={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {this.state.image ? <CardMedia style={{height: "250px", width: "300px"}}
                                                                       image={this.state.image}/>
                                            : <CardMedia style={{height: "250px", width: "300px"}}
                                                         image={this.state.publication.imageLink}/>}
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    }
};

export default PublicationModal;