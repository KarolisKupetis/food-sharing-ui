import React, {useContext, useLayoutEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import UserContext from "./UserContext";
import Swal from "sweetalert2";
import PublicationModal from "./PublicationModal";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    button: {
        margin: "10px"
    }
}));

export default function MyPublications(props) {
    const {value, setValue} = useContext(UserContext);
    const classes = useStyles();

    const [publications, setPublications] = useState([]);
    const [modal, setModal] = useState(false);
    const [workingPublication, setPublication] = useState([]);

    async function getPublications() {
        if (value.id) {
            const url = "http://localhost:8080/publication?user=" + value.id;
            const response = await fetch(url, {credentials: 'include'});
            const data = await response.json();

            setPublications(data.publications);
        }
    }

    function getStyles(style) {
        if (style == 'modal') {
            return classes.modal;
        }

        if (style == 'paper') {
            return classes.paper;
        }

        if (style == 'button') {
            return classes.button;
        }
    }

    async function deletePublication(id) {

        const response = await fetch('http://localhost:8080/publication/' + id, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.status == 204) {
            getPublications();
            Swal.fire({
                icon: 'success',
                text: 'Sėkmingai ištrintas įrašas',
            });
        }
    }

    function modalSet(status) {
        setModal(status);
        if (status == false) {
            getPublications();
        }
    }

    function editPublication(pub) {
        setPublication(pub);
        setModal(true);
    }

    useLayoutEffect(() => {
        getPublications();
    }, []);

    function deleteHandler(id) {
        deletePublication(id);
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} sm={2}>
            </Grid>
            <Grid item xs={12} sm={8}>
                <List dense>
                    {publications.map((pub) => {
                        const labelId = `checkbox-list-secondary-label-${pub.id}`;
                        return (
                            <ListItem key={pub.id} button>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Avatar n°${pub.id + 1}`}
                                        src={pub.imageLink}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={pub.name}/>
                                <ListItemSecondaryAction>
                                    <Button color="primary" variant="contained" style={{margin: "10px"}}
                                            onClick={() => editPublication(pub)}>Redaguoti</Button>
                                    <Button color="primary" variant="contained"
                                            onClick={() => deleteHandler(pub.id)}>Trinti</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
            <Grid item xs={12} sm={12}>
                {modal &&
                <PublicationModal publication={workingPublication} modalSet={modalSet} getStyles={getStyles}/>}
            </Grid>
        </Grid>
    );
}