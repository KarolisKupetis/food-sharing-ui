import React, {Component} from "react";
import Publication from "./Publication";
import { Grid } from "@material-ui/core";
import SearchBar from "./SearchBar";
import UserLocationContext from "./UserLocationContext";
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router-dom'

export default class PublicationList extends Component {
    static contextType = UserLocationContext;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            pubs: [],
            redirect: false,
            id: props.id,
            redirectPersonal : false,
            category: ''
        };
    }

    getPublication = coffeMakerObj => {
        return (
            <Grid item xs={12} sm={4} key={coffeMakerObj.id}>
                <Publication {...coffeMakerObj}/>
            </Grid>
        );
    };

    setCategory = (category) => {
        console.log(category);
        this.setState({category : category});
        this.getPublications(category);
    };

     redirectToPost = () => {
        const redirectTo = '/publications/post';
        return <Redirect to={redirectTo} />
    };

     redirectSet = () => {
       this.setState({redirect: true})
    };

     redirectPersonalSet  = () => {
         this.setState({redirectPersonal: true})
     };

     redirectToPersonal = () => {
         const redirectTo = '/publications/personal';
         return <Redirect to={redirectTo} />
     };

    async componentDidMount() {
        this.getPublications();
    }

    setPublications = (publications) => {
        this.setState({pubs : publications});
    };

     async getPublications(category)  {
        let url = "http://localhost:8080/publication?longitude="
            + this.context.location.lng
            + "&latitude="+ this.context.location.lat;

        if (category) {
            url += "&category="+ category;
        }

        const response = await fetch(url);
        const data = await response.json();

        this.setPublications(data.publications);
    };

    getPublicationsButton1 = () => {
      return (
              <Grid item xs={12} sm={2}>
                  <Button color="primary" variant="contained" onClick={this.redirectPersonalSet}>Peržiūrėti savo skelbimus</Button>
              </Grid>
      )
    };

    getPublicationsButton2 = () => {
        return (
            <Grid item xs={12} sm={2}>
                <Button color="primary" variant="contained" onClick={this.redirectSet}>Įdėti naują publikaciją</Button>
            </Grid>
        )
    };

    getRender = () => {
        return (
            <div>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4} >
                        <SearchBar categorySet = {this.setCategory}/>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                    </Grid>
                    {this.state.id && this.getPublicationsButton1()}
                    {this.state.id && this.getPublicationsButton2()}
                </Grid>
                <Grid container spacing={4}>
                    {this.state.pubs.map(coffeMakerObj => this.getPublication(coffeMakerObj))}
                </Grid>
            </div>
        )
    };

    render() {
        if (this.state.redirect && this.state.id) {
            return this.redirectToPost();
        }

        if (this.state.redirectPersonal && this.state.id) {
            return this.redirectToPersonal();
        }

        return (
           this.getRender()
        )
    }
};
