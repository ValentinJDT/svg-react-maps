import {getGradientColor} from "./Color";
import {useEffect, useState} from "react";

const SVGMap = ({
                  map,
                  colors = {
                    min: {
                      value: 0,
                      color: "#ffffff"
                    },
                    max: {
                      value: 500,
                      color: "#b00000"
                    },
                    values: {}
                  },
                  tooltip = {
                    showNum: false,
                    prefix: "",
                    suffix: "",
                  },
                  className = "",
                  style = {},
                  svgStyle = {},
                  onRegionClick = (e, code) => {
                  }
                }) => {

  const [paths, setPaths] = useState();

  const [matrix, setMatrix] = useState("1, 0, 0, 1, 0, 0");
  const [minX, setMinX] = useState(map.viewBox.minX);
  const [minY, setMinY] = useState(map.viewBox.minY);
  const [width, setWidth] = useState(map.viewBox.width);
  const [height, setHeight] = useState(map.viewBox.height);

  const zoom = (scale, x, y, up) => {
    const transformMatrix = matrix.split(", ");

    for (let i = 0; i < 4; i++) {
      const calc = parseFloat(transformMatrix[i]) * scale;
      transformMatrix[i] = calc >= 1 ? calc : ((i === 0 || i === 3) ? 1 : 0);
    }

    if (parseFloat(transformMatrix[0]) > 1) {
      transformMatrix[4] = parseFloat(transformMatrix[4]) * scale + ((up ? -1 : 1) * (x / 2));
    } else {
      transformMatrix[4] = 0;
    }

    if (parseFloat(transformMatrix[3]) > 1) {
      transformMatrix[5] = parseFloat(transformMatrix[5]) * scale + ((up ? -1 : 1) * (y / 2));
    } else {
      transformMatrix[5] = 0;
    }

    setMatrix(transformMatrix.join(', '));
  }

  useEffect(() => {
    setPaths(
      Object.values(map.paths).map((value, key) => {
          const num = Object.keys(colors.values).includes(value.id)
            ? colors.values[value.id]
            : 0;

          const color = getGradientColor(colors.min.color, colors.max.color, num / colors.max.value);

          return (
            <path
              key={key} id={value.id} d={value.d}

              style={{fill: color, stroke: "#000000", strokeWidth: "0.5px"}}

              onMouseEnter={(e) => {
                const target = document.getElementById(e.target.id);
                target.style.fill = getGradientColor(color, "#bebebe", 0.35);
              }}

              onMouseLeave={(e) => {
                const target = document.getElementById(e.target.id);
                target.style.fill = color;
              }}

              onClick={(e) => onRegionClick(e, e.target.id)}
            >
              <title>
                {value.name}{tooltip.showNum ? '\n' + (tooltip.prefix ? tooltip.prefix : "") + num + (tooltip.suffix ? tooltip.suffix : "") : ''}
              </title>
            </path>
          );
        }
      )
    );

    setMinX(map.viewBox.minX);
    setMinY(map.viewBox.minY);
    setWidth(map.viewBox.width);
    setHeight(map.viewBox.height);
    setMatrix("1, 0, 0, 1, 0, 0");
  }, [colors.max.color, colors.max.value, colors.min.color, colors.values, map, onRegionClick, tooltip.prefix, tooltip.showNum, tooltip.suffix]);

  return (
    <div id={"map"} style={{display: "flex", justifyContent: "center", ...style}}>
      <svg viewBox={`${minX} ${minY} ${width} ${height}`}
           style={{...svgStyle}}
           xmlns="http://www.w3.org/2000/svg"
           version="1.1"
           onWheel={(e) => {
             const up = e.deltaY < 0;

             const x = e.pageX - e.currentTarget.getBoundingClientRect().left;
             const y = e.pageY - e.currentTarget.getBoundingClientRect().top;

             if (up) {
               zoom(1.25, x, y, true);
             } else {
               zoom(0.75, x, y, false);
             }
           }}
      >
        <g style={{transform: "matrix(" + matrix + ")", overflow: "scroll"}}>
          {paths}
        </g>
      </svg>
    </div>
  )
}


export default SVGMap;


