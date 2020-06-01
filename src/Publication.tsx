import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import {Avatar, IconButton, CardMedia} from "@material-ui/core";
import {Redirect} from "react-router-dom";

const Publication = props => {
    const {name, status, description, imageLink, distance, id, category} = props;
    const [redirect, setRedirect] = useState(false);

    const useStyles = makeStyles(() => ({
        myStyle: {
            height: 100,
        },

        distanceStyle: {
            color: "blue"
        }
    }));

    function getCategoryMatch(category) {
        if (category === 'veg') {
            return 'vegetariškas';
        }

        if (category === 'full') {
            return 'paruoštas patiekalas'
        }

        if (category === 'ingredient') {
            return 'maisto produktas';
        }

        if (category === 'vegetable') {
            return 'daržovė';
        }
    }

    const classes = useStyles();

    function redirectToDash() {
        const redirectTo = '/publication/' + id;
        return <Redirect to={redirectTo}/>
    }

    function redirectSet() {
        setRedirect(true);
    }

    function getRender() {
        return (
            <Card>
                <CardHeader
                    avatar={<Avatar src={imageLink}/>}
                    action={
                        <IconButton aria-label="settings">
                            <ShareIcon/>
                        </IconButton>
                    }
                    title={name}
                    subheader={getCategoryMatch(category)}
                />
                <CardMedia style={{height: "300px"}} image={imageLink}/>
                <CardContent>
                    <Typography variant="body2" component="p" className={classes.myStyle}>
                        {description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={redirectSet}>Peržiūrėti plačiau</Button>
                    <Typography className={classes.distanceStyle}>
                        už {distance ?? "undefined"} km
                    </Typography>
                </CardActions>
            </Card>
        )
    }

    if (redirect) {
        return redirectToDash();
    }

    return getRender();
};

export default Publication;