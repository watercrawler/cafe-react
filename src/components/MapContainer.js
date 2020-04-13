/*global kakao*/
import React, { Component } from 'react';
import styled from 'styled-components';
import CafeInfo from './CafeInfo';

class MapContainer extends Component {
  state = {
    lat: null,
    lng: null,
    map: null,
    page: 1,
    result: null,
    roadview: false,
    position: null,
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
        this.setState({ map: map });
        const myMarker = new kakao.maps.Marker({
          position: currentPosition,
        });
        myMarker.setMap(map);

        const myPosition = '<div>내 위치</div>';
        const infowindow = new kakao.maps.InfoWindow({
          position: currentPosition,
          content: myPosition,
        });
        infowindow.open(map, myMarker);

        const places = new kakao.maps.services.Places();

        const searchOptions = {
          location: currentPosition,
          useMapCenter: true,
          useMapBounds: true,
          radius: 5000,
          size: 10,
          page: this.state.page,
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

        //로드뷰
        var mapWrapper = document.getElementById('mapWrapper'); //지도를 감싸고 있는 DIV태그

        var rvContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
        var rv = new kakao.maps.Roadview(rvContainer); //로드뷰 객체
        var rvClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

        toggleRoadview(currentPosition);

        // 마커 이미지를 생성합니다.
        var markImage = new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
          new kakao.maps.Size(26, 46),
          {
            // 스프라이트 이미지를 사용합니다.
            // 스프라이트 이미지 전체의 크기를 지정하고
            spriteSize: new kakao.maps.Size(1666, 168),
            // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
            // background-position으로 지정하는 값이며 부호는 반대입니다.
            spriteOrigin: new kakao.maps.Point(705, 114),
            offset: new kakao.maps.Point(13, 46),
          }
        );

        // 드래그가 가능한 마커를 생성합니다.
        var rvMarker = new kakao.maps.Marker({
          image: markImage,
          position: currentPosition,
          draggable: true,
          map: map,
        });

        //마커에 dragend 이벤트를 할당합니다
        kakao.maps.event.addListener(rvMarker, 'dragend', function (
          mouseEvent
        ) {
          var position = rvMarker.getPosition(); //현재 마커가 놓인 자리의 좌표
          toggleRoadview(position); //로드뷰를 토글합니다
        });

        //지도에 클릭 이벤트를 할당합니다
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          // 현재 클릭한 부분의 좌표를 리턴
          var position = mouseEvent.latLng;

          rvMarker.setPosition(position);
          toggleRoadview(position); //로드뷰를 토글합니다
        });

        //로드뷰 toggle함수
        function toggleRoadview(position) {
          //전달받은 좌표(position)에 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄웁니다
          rvClient.getNearestPanoId(position, 50, function (panoId) {
            if (panoId === null) {
              rvContainer.style.display = 'none'; //로드뷰를 넣은 컨테이너를 숨깁니다
              mapWrapper.style.width = '100%';
              map.relayout();
            } else {
              mapWrapper.style.width = '50%';
              map.relayout(); //지도를 감싸고 있는 영역이 변경됨에 따라, 지도를 재배열합니다
              rvContainer.style.display = 'block'; //로드뷰를 넣은 컨테이너를 보이게합니다
              rv.setPanoId(panoId, position); //panoId를 통한 로드뷰 실행
              rv.relayout(); //로드뷰를 감싸고 있는 영역이 변경됨에 따라, 로드뷰를 재배열합니다
            }
          });
        }
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

    const id = 'cafe_list';

    const map = this.state.map;

    // 로드뷰 토글
    // const roadview = document.getElementById('roadview');

    const onToggle = () => {
      if (!this.state.roadview) {
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        this.setState({ roadview: true });
        // roadview.style.display = 'block';
      } else {
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        this.setState({ roadview: false });
        // roadview.style.display = 'none';
      }
    };

    // console.log(this.state.map);
    return (
      <div id="mapWrapper">
        <MapContents id="map" />
        <CafeInfo id={id} />
        <RoadViewContents id="roadview" />
        <button onClick={onToggle}>로드뷰</button>
      </div>
    );
  }
}

const MapContents = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 400px;
`;

const RoadViewContents = styled.div`
  position: absolute;
  right: 0;
  bottom: 20px;
  width: 400px;
  height: 400px;
`;

export default MapContainer;
