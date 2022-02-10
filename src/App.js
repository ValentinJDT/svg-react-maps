import './App.css';

import SVGMap from "./components/SVGMap";
import franceDepartment from "./components/maps/franceDepartments.json";
import franceRegion from "./components/maps/franceRegions.json";
import worldRegions from "./components/maps/worldRegions.json";

import {useState} from "react";

/**
 * Example how to use
 * @returns {JSX.Element}
 * @constructor
 */
function App() {

  const [jsonMap, setJsonMap] = useState(worldRegions);

  const colors = {
    min: {
      value: 0,
      color: "#ffffff"
    },
    max: {
      value: 500,
      color: "#d90000"
    },
    values: {
      'FR': 150,
      'RU': 356,
      'AU': 200,
      'CA': 500,
      'BR': 150
    }
  };

  const tooltip = {
    showNum: true,
    prefix: "Value : ",
    suffix: " people(s)"
  }

  return (
    <div className="App">
      <SVGMap
        map={jsonMap}
        tooltip={tooltip}
        colors={colors}

        style={{height: "500px", width: "auto"}}
        svgStyle={{border: "0.5px solid"}}

        onRegionClick={(e, code) => {
          console.log(code);
        }}
      />
      <button onClick={(e) => {
        setJsonMap(jsonMap === worldRegions ? franceRegion : (jsonMap === franceRegion ? franceDepartment : worldRegions));
      }}>Change map
      </button>
    </div>
  );
}

export default App;
