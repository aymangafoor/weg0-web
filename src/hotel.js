import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';
import './hotel.css';
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
class hotel extends Component {

  state = {
    hotel: []
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
      lng: null

    }
  }
  getrent = () => {
    var lat = this.state.lat;
    var lng = this.state.lng
    console.log(lat, lng);
    fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=lodging&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.results[1]);
        this.setState({
          hotel: responseJson.results
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
            inputStyle={{ width: '88%', height: 20, borderRadius: 10, marginRight: 50, float: 'right', marginTop: -45 }}
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
        <h1>Nearby Lodges and Inn</h1>

        <div className='places' id='content' style={{ overflowX: 'scroll', overflowY: 'hidden', height: 260, whiteSpace: 'nowrap', display: 'flex', width: '94%',marginLeft:40 }}>
          <img id="left-button" src={left} alt='left' onClick={() => { scrollLeft(document.getElementById('content'), -300, 1000) }} style={{position:'absolute',left:0,alignSelf:'center'}}>
            
          </img>
          {this.state.hotel ? (

            this.state.hotel.map(item => {

              return (
                <div className='card' key={item.id} >
                  {item.photos !== undefined && <div className='card-avatar'>
                    <img className='card-avatar--image' alt='' src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyChiwupcs4om20XFLC7iylVTO5Ef6OTH90`}></img>
                    <h3 className='title'>{item.name}</h3>
                  </div>}
                </div>
              )
            })
          ) : (<h1 >Places data is Loading...</h1>)}
          <img src={right} alt='right' id="right-button" onClick={() => { scrollLeft(document.getElementById('content'), 300, 1000) }} style={{position:'absolute',right:0,alignSelf:'center'}}>
          
          </img>
        </div>

      </div>
    )
  }
} export default hotel;