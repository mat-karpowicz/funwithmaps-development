import React, { useState } from "react";
import { LinearInterpolator } from "react-map-gl";

function Hub({
  funData,
  setFunData,
  handleNext,
  mapControl,
  setMapControl,
  viewport,
  setViewport,
  options,
  setOptions,
}) {
  const [hints, setHints] = useState({
    showRegion: false,
    showSubRegion: false,
    showBorders: false,
  });

  return (
    <div className="hub flex flex-col flex-jc-sb">
      <div className="hub-box flex">
        <div className="hub-info">
          <h3 className="country">
            Country: <strong>{funData.country.name}</strong>
          </h3>
          <h3>
            Capital: <strong>{funData.country.capital}</strong>
          </h3>
          <img src={`${funData.country.flag}`} alt="flag" className="flag" />
          <h3>
            Region:
            {hints.showRegion ? (
              <strong> {funData.country.region}</strong>
            ) : (
              <button
                className="btn hub-btn"
                onClick={() => {
                  setFunData({
                    ...funData,
                    pointsToGet: funData.pointsToGet - 1,
                  });
                  setHints({ ...hints, showRegion: true });
                }}
              >
                hint -1pt
              </button>
            )}
          </h3>
          <h3>
            Sub-region:
            {hints.showSubRegion ? (
              <strong> {funData.country.subregion}</strong>
            ) : (
              <button
                className="btn hub-btn"
                onClick={() => {
                  setFunData({
                    ...funData,
                    pointsToGet: funData.pointsToGet - 2,
                  });
                  setHints({ ...hints, showSubRegion: true });
                }}
              >
                hint -2pt
              </button>
            )}
          </h3>
          <h3>
            Borders:
            {hints.showBorders ? (
              funData.country.borders.map((border) => (
                <React.Fragment key={border}>
                  <strong> {border}</strong> |{" "}
                </React.Fragment>
              ))
            ) : (
              <button
                className="btn hub-btn"
                onClick={() => {
                  setFunData({
                    ...funData,
                    pointsToGet: funData.pointsToGet - 3,
                  });
                  setHints({ ...hints, showBorders: true });
                }}
              >
                hint -3pt
              </button>
            )}
          </h3>
        </div>
        <div className="hub-stats">
          <h3>Round: {funData.round}</h3>
          <h3>Points: {funData.points}</h3>
          <h3>To get: {funData.pointsToGet}</h3>
        </div>
      </div>
      {funData.answer.answered ? (
        <div className="answer">
          {funData.answer.correct ? (
            <h2 className="correct">Correct!</h2>
          ) : (
            <h2 className="wrong">Wrong!</h2>
          )}

          <div className="answer-btns flex flex-jc-sa">
            <button
              className="btn hub-btn"
              onClick={() => {
                setMapControl({
                  ...mapControl,
                  marker: {
                    show: false,
                  },
                  popup: {
                    show: false,
                  },
                });
                setFunData({
                  ...funData,
                  points: 0,
                  round: 1,
                  pointsToGet: 10,
                });
                setOptions({
                  ...options,
                  funStarted: false,
                  blockAnswer: false,
                });
              }}
            >
              end session
            </button>
            <button
              className="btn hub-btn"
              onClick={() => {
                setHints({
                  showRegion: true,
                  showSubRegion: true,
                  showBorders: true,
                });
                setMapControl({
                  ...mapControl,
                  marker: {
                    show: true,
                    latitude: funData.country.latlng[0],
                    longitude: funData.country.latlng[1],
                  },
                });
                setViewport({
                  ...viewport,
                  latitude: funData.country.latlng[0],
                  longitude: funData.country.latlng[1],
                  zoom: 6,
                  transitionDuration: 2000,
                  transitionInterpolator: new LinearInterpolator(),
                });
              }}
            >
              show me
            </button>
            <button
              className="btn hub-btn"
              onClick={() => {
                setHints({
                  showBorders: false,
                  showRegion: false,
                  showSubRegion: false,
                });
                handleNext();
              }}
            >
              next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Hub;
