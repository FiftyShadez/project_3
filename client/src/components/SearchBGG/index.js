import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import './bgg.css';
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        marginLeft: '1rem !important'
    },
    chip: {
        padding: '0px',
        marginTop: '10px',
        marginBottom: '10px',
        cursor: 'pointer',
        // borderRadius: '5px',
        borderStyle: 'none'
    },
    chipdiv: {
        textAlign: 'center',
        marginLeft: '16px'
    }
}));

function SearchBGG(props) {
    const classes = useStyles();

    const [gamePrev, setGamePrev] = useState({});
    const [games, setGames] = useState([]);
    // const [query, setQuery] = useState('catan');
    // const [search, setSearch] = useState('');
    const [value, setValue] = useState('Settlers of Catan');
    const [inputValue, setInputValue] = useState(''); 
    const [gameList, setGameList] = useState([]); 

    let searchValue;
    let newInputValue;  

    useEffect(() => {
        const getGameList = async() => {
            const response = await axios.get(`/api/gamelist/`);
            for (var i = 0; i < 50; i++) {
                let responseString = response.data.elements[0].elements[i];
                let hotItem = {
                    id: responseString.attributes.id,
                    title: responseString.elements[1].attributes.value,
                    year: responseString.elements[2].attributes.value,
                };
                setGameList(gameList => [...gameList, hotItem]);
            }
        }
        getGameList();
        }, []);

    function getPreview(id) {
        const fetchPreview = async() => {
            const response = await axios.get(`/api/ids/${id}`);
            let gameId = response.data.elements[0].elements[0].attributes.id;
            let name, image, description, minPlayers, maxPlayers, minPlayTime, maxPlayTime, yearPublished;
    
            for (let i = 0; i < response.data.elements[0].elements[0].elements.length; i++) {
                if (response.data.elements[0].elements[0].elements[i].name === "thumbnail") {
                    image = response.data.elements[0].elements[0].elements[0].elements[0].text
                }
                if (response.data.elements[0].elements[0].elements[i].name === "name") {
                    name = response.data.elements[0].elements[0].elements[2].attributes.value
                }
                if (response.data.elements[0].elements[0].elements[i].name === "minplayers") {
                    minPlayers = response.data.elements[0].elements[0].elements[i].attributes.value
                }
                if (response.data.elements[0].elements[0].elements[i].name === 'maxplayers') {
                    maxPlayers = response.data.elements[0].elements[0].elements[i].attributes.value
                }
                if (response.data.elements[0].elements[0].elements[i].name === 'description') {
                    description = response.data.elements[0].elements[0].elements[i].elements[0].text
                }
                if (response.data.elements[0].elements[0].elements[i].name === 'minplaytime') {
                    minPlayTime = response.data.elements[0].elements[0].elements[i].attributes.value
                }
                if (response.data.elements[0].elements[0].elements[i].name === 'maxplaytime') {
                    maxPlayTime = response.data.elements[0].elements[0].elements[i].attributes.value
                }
                if (response.data.elements[0].elements[0].elements[i].name === 'yearpublished') {
                    yearPublished = response.data.elements[0].elements[0].elements[i].attributes.value
                }
            }

            const gamePrevObj = {
                gameId: gameId,
                name: name,
                image: image,
                description: description,
                minPlayers: minPlayers,
                maxPlayers: maxPlayers,
                minPlayTime: minPlayTime,
                maxPlayTime: maxPlayTime,
                yearPublished: yearPublished,
            }
            setGamePrev(gamePrevObj);
            props.setAppState(gamePrevObj);
        }   
        fetchPreview(); 
    };

    function renderGameToDOM(e, inputValue) {
        e.preventDefault();
        console.log('inputValue!!!: ', inputValue, games)
        const fetchData = async() => {
            const response = await axios.get(`/api/games/${inputValue}`);
            let game = {
                gameId: response.data.elements[0].elements[0].attributes.objectid,
                name: response.data.elements[0].elements[0].elements[0].elements[0].text,
            }
            setGames(game);
            }
        fetchData(); 
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
            {/* <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div> */}
            {/* <div>{`inputValue: '${inputValue}'`}</div> */}
                <Autocomplete
                    // // value={value}
                    // onChange={(event, newValue) => {
                    //     setValue(newValue);
                    //     setInputValue(newValue);
                    //   }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        console.log('newinputvalue: ',newInputValue)
                        console.log(inputValue)
                      }}
                    // newInputValue={newInputValue}
                    id="topGamesDropdown"
                    disableClearable
                    options={gameList.map((option) => option.title)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search for Board Game"
                            variant="outlined"
                            multiline={true}
                        />
                    )}
                />
                <button onClick={(e) => renderGameToDOM(e, inputValue)}>Sumbit</button>
            </Paper>
            <Grid item xs={12}>
                <div className={classes.chipdiv}>
                        <button 
                            id="chip" 
                            className={classes.chip}
                            label={games.name}                                 
                            key={games.gameId} 
                            value={games.gameId} 
                            onClick={() => {
                                getPreview(games.gameId)
                                }
                            }
                        >
                            {games.name}
                        </button>
                </div>
            </Grid>
        </div>
    )
}

export default SearchBGG;