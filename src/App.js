import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

// COMPONENTS
import Menu from "./components/Menu";
import Hub from "./components/Hub";
import Error from "./components/Error";
import marker from "./assets/pin.png";

// HELPERS
import startFun from "./helpers/startFun";
import checkAnswer from "./helpers/checkAnswer";

function App() {
  // STATE

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 48.499998,
    longitude: 23.3833318,
    zoom: 2,
  });

  const [error, setError] = useState(false);

  const [options, setOptions] = useState({
    funStarted: false,
    easyLevel: true,
    blockAnswer: false,
  });

  const [funData, setFunData] = useState({
    countries: [],
    round: 1,
    points: 0,
    pointsToGet: 10,
  });

  const [mapControl, setMapControl] = useState({
    popup: {
      show: false,
      longitude: null,
      latitude: null,
    },
    marker: {
      show: false,
      longitude: null,
      latitude: null,
    },
  });

  // HANDLERS

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setOptions({ ...options, blockAnswer: false });
      }, 3000);
    }
  }, [error, options]);

  const handleStart = async () => {
    const countries = await startFun();

    if (countries && countries.stack && countries.message) {
      return setError(true);
    }

    setFunData({
      ...funData,
      countries,
      country: countries[Math.floor(Math.random() * countries.length)],
      answer: {
        answered: false,
        correct: false,
      },
    });
    setOptions({ ...options, funStarted: true });
  };

  const handleAnswer = async () => {
    setMapControl({
      ...mapControl,
      popup: {
        show: false,
      },
    });

    setOptions({ ...options, blockAnswer: true });

    const answer = await checkAnswer(
      mapControl.popup.longitude,
      mapControl.popup.latitude,
      funData.country
    );

    if (answer && answer.stack && answer.message) {
      return setError(true);
    }

    answer
      ? setFunData({
          ...funData,
          points: funData.points + funData.pointsToGet,
          answer: { answered: true, correct: true },
        })
      : setFunData({ ...funData, answer: { answered: true, correct: false } });
  };

  const handleNext = () => {
    setMapControl({
      ...mapControl,
      popup: { show: false },
      marker: { show: false },
    });

    setFunData({
      ...funData,
      country:
        funData.countries[Math.floor(Math.random() * funData.countries.length)],
      round: funData.round + 1,
      pointsToGet: 10,
      answer: {
        answered: false,
      },
    });

    setOptions({ ...options, blockAnswer: false });
  };

  const handleResize = () => {
    console.log("resizd");
    setViewport({ ...viewport, width: "100vw", height: "100vh" });
  };

  window.onresize = handleResize;

  // MAP COMPONENT

  const map = (
    <ReactMapGL
      mapStyle={
        options.easyLevel
          ? process.env.REACT_APP_MAP_EASY
          : process.env.REACT_APP_MAP_NORM
      }
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      doubleClickZoom={false}
      onDblClick={
        options.blockAnswer
          ? () => {}
          : ({ lngLat }) =>
              setMapControl({
                ...mapControl,
                popup: {
                  show: true,
                  longitude: lngLat[0],
                  latitude: lngLat[1],
                },
              })
      }
    >
      {mapControl.marker.show ? (
        <Marker
          latitude={mapControl.marker.latitude}
          longitude={mapControl.marker.longitude}
        >
          <img src={marker} alt="logo" className="marker" />
        </Marker>
      ) : null}
      {mapControl.popup.show ? (
        <Popup
          longitude={mapControl.popup.longitude}
          latitude={mapControl.popup.latitude}
          anchor={"top"}
          closeButton={false}
        >
          <div className="popup">
            Are you sure?
            <div className="flex flex-jc-sa">
              <button className="btn" onClick={() => handleAnswer()}>
                YES
              </button>
              <button
                className="btn"
                onClick={() =>
                  setMapControl({ ...mapControl, popup: { show: false } })
                }
              >
                NO
              </button>
            </div>
          </div>
        </Popup>
      ) : null}
    </ReactMapGL>
  );

  return (
    <div className="App">
      {error ? <Error /> : null}
      {options.funStarted ? (
        <Hub
          funData={funData}
          setFunData={setFunData}
          handleNext={handleNext}
          mapControl={mapControl}
          setMapControl={setMapControl}
          viewport={viewport}
          setViewport={setViewport}
          options={options}
          setOptions={setOptions}
        />
      ) : (
        <Menu
          options={options}
          setOptions={setOptions}
          handleStart={handleStart}
        />
      )}
      <>{map}</>
    </div>
  );
}

export default App;
