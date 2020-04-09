/*global kakao*/
import React, { Component } from 'react';
import styled from 'styled-components';

class MapContainer extends Component {
  state = {
    lat: 37.506502,
    lng: 127.053617,
  };

  componentDidMount() {
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=6c12172df5d72715235107cb3f7fb500&autoload=false';
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById('map');
        let options = {
          center: new kakao.maps.LatLng(this.state.lat, this.state.lng),
          level: 7,
        };

        const map = new window.kakao.maps.Map(container, options);
      });
    };
  }

  render() {
    const success = (pos) => {
      const crd = pos.coords;
      const lat = crd.latitude;
      const lng = crd.longitude;
      this.setState({
        lat,
        lng,
      });
    };

    navigator.geolocation.getCurrentPosition(success);
    return <MapContents id="map"></MapContents>;
  }
}

const MapContents = styled.div`
  width: 500px;
  height: 500px;
`;

export default MapContainer;
