/*global kakao*/
import React, { Component } from 'react';
import styled from 'styled-components';
import CafeInfo from './CafeInfo';

class MapContainer extends Component {
  state = {
    lat: 37.506502,
    lng: 127.053617,
  };

  componentDidMount() {
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=6c12172df5d72715235107cb3f7fb500&autoload=false&libraries=services,clusterer,drawing';
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById('map');

        const currentPosition = new kakao.maps.LatLng(
          this.state.lat,
          this.state.lng
        );
        let options = {
          center: currentPosition,
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);
        const myMarker = new kakao.maps.Marker({
          position: currentPosition,
        });
        myMarker.setMap(map);

        const places = new kakao.maps.services.Places();

        const searchOptions = {
          location: currentPosition,
          useMapCenter: true,
          useMapBounds: true,
          radius: 5000,
          size: 15,
          page: 2,
        };

        const callback = function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            console.log(result);

            result.forEach((element) => {
              const x = parseFloat(element.x);
              const y = parseFloat(element.y);
              console.log(element);

              const markers = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(y, x),
              });

              const placeName = element.place_name;

              const labels = new kakao.maps.InfoWindow({
                position: markers.position, // 지도의 중심좌표에 올립니다.
                content: placeName, // 인포윈도우 내부에 들어갈 컨텐츠 입니다.
              });
              labels.open(map, markers); // 지도에 올리면서, 두번째 인자로 들어간 마커 위에 올라가도록 설정합니다.

              markers.setMap(map);
              const li = document.createElement('li');
              const anchor = document.createElement('a');
              const cafeList = document.getElementById('cafe_list');
              const url = element.place_url;
              anchor.innerText = placeName;
              cafeList.appendChild(li);
              li.appendChild(anchor);
              anchor.setAttribute('href', url);
            });
          }
        };

        places.keywordSearch('카페', callback, searchOptions);
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
    return (
      <>
        <MapContents id="map" />
        <CafeList id="cafe_list" />
      </>
    );
  }
}

const MapContents = styled.div`
  width: 500px;
  height: 500px;
`;

const CafeList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default MapContainer;
