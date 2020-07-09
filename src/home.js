import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';
import './home.css';
import left from './images/left-arrow.png'
import right from './images/right-arrow.png'

function scrollLeft(element, change, duration) {
    var start = element.scrollLeft,
        currentTime = 0,
        increment = 20;

    console.log(start)

    var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};
class home extends Component {
    state = {
        places: [],
        museum: [],
    }
    constructor() {
        super()
        Geolocation.getCurrentPosition(
            info => {
                console.log(info);
                this.setState({
                    lat: info.coords.latitude,
                    lng: info.coords.longitude,
                }, () => this.getrent())
            })
        this.state = {
            lat: null,
            lng: null,

        }
    }

    getrent = () => {
        var lat = this.state.lat;
        var lng = this.state.lng
        console.log(lat, lng);
        fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=20000&type=tourist_attraction&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('hi', responseJson.results[0].name);
                this.setState({
                    places: responseJson.results,
                })
            })
            .catch((error) => {
                console.error(error);
            });
        fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=25000&keyword=museum&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('mu', responseJson.results[0]);
                this.setState({
                    museum: responseJson.results,
                })
            })
            .catch((error) => {
                console.error(error);
            });

    }
    render() {
        return (
            <div className='hotel'>
                <div className='search'>
                    <h2 className='search-title'>Search: </h2>
                    <GooglePlacesAutocomplete
                        placeholder='Search Nearest Placefrom:'
                        inputStyle={{ width: '88%', height: 20, borderRadius: 10, marginRight: 50, float: 'right', marginTop: -45,borderWidth:1,textAlign:'center' }}
                        suggestionsStyles={{
                            container: {
                                color: 'black',
                                marginTop: 0,
                                borderBottomRadius: 10,
                            },
                            suggestion: {
                                background: 'grey',
                                marginLeft: 130,
                                width: '88%',
                                position: 'relative',
                                zIndex: 1,
                                borderBottomRadius: 10,
                                borderWidth: 1,
                                textAlign: 'center',
                            },
                        }}
                        onSelect={(data) => {
                            console.log(data)
                            geocodeByAddress(data.description)
                                .then(results => getLatLng(results[0]))
                                .then(({ lat, lng }) =>
                                    this.setState({
                                        lat: lat,
                                        lng: lng
                                    }, () => this.getrent())
                                );


                        }}
                        apiKey='AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90'
                        autocompletionRequest={{
                            componentRestrictions: {
                                country: ['in'],
                            }
                        }}

                    />
                </div>

                <h1 className='heading'>Nearby Places</h1>
                <div className='places' id='content' style={{ overflowX: 'scroll', overflowY: 'hidden', height: 260, whiteSpace: 'nowrap', display: 'flex', width: '94%', marginLeft: 40,border:'none' }}>
                    <img id="left-button" src={left} alt='left' onClick={() => { scrollLeft(document.getElementById('content'), -300, 1000) }} style={{ position: 'absolute', left: 0, alignSelf: 'center' }}>
                    </img>
                    {this.state.places ? (
                        this.state.places.map(item => {
                            return (
                                <div className='card' key={item.id}>
                                    {item.photos !== undefined && <div className='card-avatar'>
                                        <img className='card-avatar--image' alt='' src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`}></img>
                                        <h3 className='title'>{item.name}</h3>
                                    </div>}
                                </div>
                            )
                        })
                    ) : (<h1 > Loading...</h1>)}
                    <img src={right} alt='right' id="right-button" onClick={() => { scrollLeft(document.getElementById('content'), 300, 1000) }} style={{ position: 'absolute', right: 0, alignSelf: 'center' }}>
                    </img>
                </div>
                <div className='places' id='content1' style={{ overflowX: 'scroll', overflowY: 'hidden', height: 260, whiteSpace: 'nowrap', display: 'flex', width: '94%', marginLeft: 40,border:'none' }}>
                    <img id="left-button" src={left} alt='left' onClick={() => { scrollLeft(document.getElementById('content1'), -300, 1000) }} style={{ position: 'absolute', left: 0, alignSelf: 'center' }}>

                    </img>
                    {this.state.museum ? (this.state.museum.map(item => {
                        return (
                            <div className='card' key={item.id}>
                                {item.photos !== undefined && <div className='card-avatar'>
                                    <img className='card-avatar--image' alt='' src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`}></img>
                                    <h3 className='title'>{item.name}</h3>
                                </div>}
                            </div>
                        )

                    })
                    ) : (<h1 >Loading...</h1>)}
                    <img src={right} alt='right' id="right-button" onClick={() => { scrollLeft(document.getElementById('content1'), 300, 1000) }} style={{ position: 'absolute', right: 0, alignSelf: 'center' }}>

                    </img>
                </div>
                <div style={{ height: 60 }}></div>
            </div>
        );
    }
}
export default home;