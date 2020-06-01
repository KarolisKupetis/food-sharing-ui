import React, {useState} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";

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


const SearchBar = (props) => {
    const [category, setCategory] = useState('full');

    const onChange = (event) => {
        if (event.target.name == "category") {
            setCategory(event.target.value);
            props.categorySet(event.target.value);
        }
    };

    return (
        <div>
            <TextField
                id="filled-select-currency"
                select
                label="Kategorija"
                defaultValue={"veg"}
                helperText="Pasirinkite maisto kategorija"
                variant="standard"
                name="category"
                fullWidth={true}
                onChange={onChange}
                value={category}
            >
                {types.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default SearchBar;