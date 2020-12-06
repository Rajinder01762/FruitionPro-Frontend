import React from "react";
import styled, { keyframes } from "styled-components";

const Svg = styled("svg")`
  font-size: 70px;
  width: 1em;
  height: 1em;
  fill: none;
  stroke: #3387f9;
  stroke-miterlimit: 10;
  stroke-width: 5px;
  margin-bottom: 15px;
`;

const animationTime = 0.5;

const circleAnimation = keyframes`
0% { stroke-dasharray: 0 181; }
1% { stroke-linecap:round; }
100% { stroke-dasharray: 181 181; stroke-linecap:round; }
`;
const Circle = styled("path")`
  transform-origin: 40.735px 40.735px;
  transition: 0.5s;
  stroke-dasharray: 0 181;
  transform: scale(-1, 1) rotate(-90deg);
  animation: ${circleAnimation} ${animationTime}s forwards;
`;

const checkAnimation = keyframes`
0% { stroke-dasharray: 0 83; }
1% { stroke-linecap:round; }
100% { stroke-dasharray: 83 83; stroke-linecap:round; }
`;
const Check = styled("polyline")`
  transition: 0.5s;
  stroke-dasharray: 0 83;
  animation: ${checkAnimation} ${animationTime}s forwards;
  animation-delay: ${animationTime}s;
`;
export default () => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81.47 81.47">
    <Check points="20.28 33.45 37.91 51.67 78.97 11.94" />
    <Circle d="M79,40.69v.05A38.24,38.24,0,1,1,40.74,2.5h.18" />
  </Svg>
);
