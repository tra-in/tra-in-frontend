import React from "react";
import Svg, { Path } from "react-native-svg";

export const HomeIcon = ({ size = 24, color = "#005DB3" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.2288 7.33647L14.0499 3.70905C12.6383 2.71893 10.4715 2.77294 9.1139 3.82606L4.60939 7.34547C3.71029 8.04755 3 9.48772 3 10.6218V16.8325C3 19.1278 4.86114 21 7.15385 21H16.8461C19.1389 21 21 19.1368 21 16.8415V10.7388C21 9.52372 20.2178 8.02955 19.2288 7.33647ZM12.6743 17.3996C12.6743 17.7686 12.3686 18.0747 12 18.0747C11.6314 18.0747 11.3257 17.7686 11.3257 17.3996V14.6993C11.3257 14.3302 11.6314 14.0242 12 14.0242C12.3686 14.0242 12.6743 14.3302 12.6743 14.6993V17.3996Z"
      fill={color}
    />
  </Svg>
);

export const ActivityIcon = ({ size = 24, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.3 21H14.7C19.2 21 21 19.2 21 14.7V9.3C21 4.8 19.2 3 14.7 3H9.3C4.8 3 3 4.8 3 9.3V14.7C3 19.2 4.8 21 9.3 21Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 14L10.0385 11.5181C10.3298 11.1647 10.8694 11.1004 11.2463 11.3735L12.8137 12.5301C13.1906 12.8032 13.7302 12.739 14.0214 12.3936L16 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarIcon = ({ size = 24, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 9.08997H20.5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6947 13.7H15.7037"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6947 16.7H15.7037"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 13.7H12.0045"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 16.7H12.0045"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.29431 13.7H8.30329"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.29431 16.7H8.30329"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ProfileIcon = ({ size = 24, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowRightIcon = ({ size = 16, color = "#005DB3" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6 3L11 8L6 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PhoneIcon = ({ size = 17, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
    <Path
      d="M15.5834 12.0417V14.1667C15.5841 14.3629 15.5434 14.5571 15.4638 14.7367C15.3843 14.9162 15.2677 15.0772 15.1216 15.2092C14.9754 15.3412 14.803 15.4413 14.6153 15.503C14.4276 15.5647 14.2289 15.5867 14.0321 15.5677C11.8583 15.3301 9.77518 14.5549 7.94926 13.3031C6.25225 12.1556 4.82271 10.6261 3.77509 8.82916C2.51701 6.99457 1.74183 4.90093 1.50884 2.71791C1.48993 2.52189 1.51179 2.32397 1.57308 2.13684C1.63436 1.9497 1.73383 1.77771 1.86516 1.63166C1.99649 1.48562 2.15683 1.36887 2.33573 1.28887C2.51463 1.20887 2.70814 1.16747 2.90384 1.16749H5.02884C5.36623 1.16422 5.69252 1.28324 5.94764 1.50323C6.20276 1.72322 6.37005 2.02958 6.41926 2.36499C6.51187 3.03498 6.68194 3.69295 6.92634 4.32707C7.02264 4.58078 7.04215 4.85711 6.98268 5.1218C6.9232 5.38649 6.78724 5.62857 6.59134 5.81999L5.68384 6.72749C6.71876 8.49453 8.24712 10.0229 10.0142 11.0578L10.9217 10.1503C11.1131 9.9544 11.3552 9.81843 11.6199 9.75896C11.8846 9.69949 12.1609 9.71899 12.4146 9.81529C13.0487 10.0597 13.7067 10.2298 14.3767 10.3224C14.716 10.3721 15.0257 10.5423 15.2469 10.8018C15.4682 11.0613 15.5857 11.3923 15.5834 11.7337V12.0417Z"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MapPinIcon = ({ size = 17, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
    <Path
      d="M14.875 7.08333C14.875 11.6875 8.5 15.5833 8.5 15.5833C8.5 15.5833 2.125 11.6875 2.125 7.08333C2.125 5.39348 2.79665 3.77269 3.9953 2.57405C5.19395 1.3754 6.81473 0.70375 8.5 0.70375C10.1853 0.70375 11.8061 1.3754 13.0047 2.57405C14.2033 3.77269 14.875 5.39348 14.875 7.08333Z"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 9.20833C9.67312 9.20833 10.625 8.25645 10.625 7.08333C10.625 5.91021 9.67312 4.95833 8.5 4.95833C7.32688 4.95833 6.375 5.91021 6.375 7.08333C6.375 8.25645 7.32688 9.20833 8.5 9.20833Z"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ClockIcon = ({ size = 17, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
    <Path
      d="M8.5 15.5833C12.4121 15.5833 15.5833 12.4121 15.5833 8.5C15.5833 4.58794 12.4121 1.41667 8.5 1.41667C4.58794 1.41667 1.41667 4.58794 1.41667 8.5C1.41667 12.4121 4.58794 15.5833 8.5 15.5833Z"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 4.25V8.5L11.3333 9.91667"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronDownIcon = ({ size = 17, color = "#77777A" }) => (
  <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
    <Path
      d="M4.25 6.375L8.5 10.625L12.75 6.375"
      stroke={color}
      strokeWidth="1.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowLeftIcon = ({ size = 34, color = "#FFFFFF" }) => (
  <Svg width="34" height="42" viewBox="0 0 34 42" fill="none">
    <Path
      d="M4.25 21L16 10.5M4.25 21L16 31.5M4.25 21H29.75"
      stroke={color}
      strokeWidth="2.625"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckIcon = ({ size = 20, color = "#005DB3" }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M16.6667 5L7.50004 14.1667L3.33337 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const VectorIcon = ({ size = 27, color = "#005DB3" }) => (
  <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
    <Path
      d="M3.50003 15.5005L12.5 23.5005L23.5 3.50049"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
