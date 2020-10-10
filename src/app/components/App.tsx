import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "../styles/ui.css";

declare function require(path: string): any;

const App = ({}) => {
  const [styleMode, setStyleMode] = useState("customMapboxStyle"); // mapboxStyle

  let [viewport, setViewport] = useState({
    longitude: -77.03968,
    latitude: 38.89744,
    zoom: 8,
    bearing: 0,
    pitch: 0,
    width: 560,
    height: 560
  });
  const [mapExportWidth, setMapExportWidth] = useState(800);
  const [mapExportHeight, setMapExportHeight] = useState(600);
  const [isRetina, setIsRetina] = useState(false);
  const onToggleRetina = () => {
    setIsRetina(!isRetina);
  };

  const [username, setUsername] = useState("qatium");
  const [style_id, setStyleID] = useState("ckaf3fzi6200k1ipufjkbt50v");
  const [accessToken, setAccessToken] = useState(
    "pk.eyJ1IjoicWF0aXVtIiwiYSI6ImNrM2lrNzE1djA4a3ozY2xjeDFiMzA3b24ifQ.baOd_O4sWca3ma4klyW7Mw"
  );

  const onDrawMap = () => {
    let imurl = `https://api.mapbox.com/styles/v1/${username}/${style_id}/static/${
      viewport.longitude
    },${viewport.latitude},${viewport.zoom},${viewport.bearing},${
      viewport.pitch
    }/${mapExportWidth}x${mapExportHeight}${
      isRetina ? "@2x" : ""
    }?access_token=${accessToken}`;
    fetch(imurl)
      .then(r => r.arrayBuffer())
      .then(a =>
        parent.postMessage(
          {
            pluginMessage: {
              type: "draw-map",
              width: mapExportWidth,
              height: mapExportHeight,
              data: new Uint8Array(a)
            }
          },
          "*"
        )
      );
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;
      if (type === "map-drawed") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  useEffect(() => {});

  return (
    <div className="main-wrapper">
      {/* <img src={require('../assets/logo.svg')} /> */}
      <div className="map-wrapper">
        <ReactMapGL
          {...viewport}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          mapboxApiAccessToken={accessToken}
          mapStyle={`mapbox://styles/${username}/${style_id}`}
          width="100%"
          height="100%"
        />
      </div>
      <div className="side-panel">
        <div className="form-block style-mode">
          {/* TODO hacer dinámico este cambio, que guarde el estado anterior de user y mapstyle */}
          <input
            type="radio"
            id="mapboxStyle"
            name="mapStyleSelector"
            value="mapboxStyle"
            checked={styleMode === "mapboxStyle"}
            onClick={() => {
              setStyleMode("mapboxStyle");
              setUsername("mapbox");
              setStyleID("streets-v11");
            }}
          />
          <label htmlFor="mapboxStyle" className="mr-3">
            {" "}
            Mapbox style
          </label>
          <input
            type="radio"
            id="customMapboxStyle"
            name="mapStyleSelector"
            value="customMapboxStyle"
            checked={styleMode === "customMapboxStyle"}
            onClick={() => {
              setStyleMode("customMapboxStyle");
              setUsername("qatium");
              setStyleID("ckaf3fzi6200k1ipufjkbt50v");
            }}
          />
          <label htmlFor="customMapboxStyle"> Custom style</label>
        </div>
        <hr />
        {styleMode === "customMapboxStyle" ? (
          <div className="form-block">
            <h2>Mapbox custom style</h2>
            <label htmlFor="tokenInput">Mapbox API access token</label>
            <input
              name="tokenInput"
              id="tokenInput"
              value="pk.eyJ1IjoicWF0aXVtIiwiYSI6ImNrM2lrNzE1djA4a3ozY2xjeDFiMzA3b24ifQ.baOd_O4sWca3ma4klyW7Mw"
              onChange={e => setAccessToken(e.target.value)}
            />

            <label htmlFor="usernameInput">Mapbox user name</label>
            <input
              name="usernameInput"
              value="qatium"
              onChange={e => setUsername(e.target.value)}
            />

            <label htmlFor="mapStyleInput">Mapbox Style ID</label>
            <input
              name="mapStyleInput"
              value="ckaf3fzi6200k1ipufjkbt50v"
              onChange={e => setStyleID(e.target.value)}
            />
          </div>
        ) : (
          <div className="form-block">
            <h2>Mapbox default styles</h2>
            <label htmlFor="mapbox-styles">Map style</label>
            <select
              name="mapbox-styles"
              id="mapbox-styles"
              onChange={e => setStyleID(e.currentTarget.value)}
            >
              <option value="streets-v11">streets</option>
              <option value="light-v10">light</option>
              <option value="dark-v10">dark</option>
              <option value="outdoors-v11">outdoors</option>
              <option value="satellite-v9">satellite</option>
            </select>
          </div>
        )}

        <hr />
        <div className="form-block">
          <h2>Map properties</h2>
          <label htmlFor="mapPosition">Position</label>
          <input
            name="mapPosition"
            value={viewport.latitude + "," + viewport.longitude}
          />
        </div>
        <hr />
        <div className="form-block">
          <div className="container-fluid p-0">
            <div className="row custom-gutter">
              <div className="col-4">
                <label htmlFor="mapZoom">Zoom</label>
                <input name="mapZoom" value={viewport.zoom} />
              </div>
              <div className="col-4">
                <label htmlFor="mapPitch">Pitch</label>
                <input name="mapPitch" value={viewport.pitch} />
              </div>
              <div className="col-4">
                <label htmlFor="mapBearing">Bearing</label>
                <input name="mapBearing" value={viewport.bearing} />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="form-block">
          <h2>Image size</h2>
          <div className="container-fluid p-0">
            <div className="row custom-gutter">
              <div className="col-4">
                <label htmlFor="mapWidth">Width</label>
                <input
                  name="mapWidth"
                  title="Max. 1280"
                  value={mapExportWidth}
                  onChange={e => setMapExportWidth(Number(e.target.value))}
                />
              </div>
              <div className="col-4">
                <label htmlFor="mapHeight">Height</label>
                <input
                  name="mapHeight"
                  title="Max. 1280"
                  value={mapExportHeight}
                  onChange={e => setMapExportHeight(Number(e.target.value))}
                />
              </div>
              <div className="col-4 retina-check">
                <input
                  type="checkbox"
                  name="retinaCheck"
                  checked={isRetina}
                  onChange={onToggleRetina}
                />
                <label htmlFor="retinaCheck"> @2x</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="side-panel__footer p-2">
        <button id="draw-map" className="primary" onClick={onDrawMap}>
          Draw map to Figma
        </button>
      </div>
    </div>
  );
};

export default App;
