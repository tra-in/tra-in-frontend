import React from "react";

/* =========================
 * BottomNavigation 아이콘
 * ========================= */

// home
import Home from "../../assets/Icons/home.svg";
import HomeFill from "../../assets/Icons/home_fill.svg";

// activity (travel)
import Activity from "../../assets/Icons/activity.svg";
import ActivityFill from "../../assets/Icons/activity_fill.svg";

// calendar (records)
import Calendar from "../../assets/Icons/calendar.svg";
import CalendarFill from "../../assets/Icons/calendar_fill.svg";

// profile (fill 없음 → 동일 아이콘 사용)
import Profile from "../../assets/Icons/profile.svg";
import ProfileFill from "../../assets/Icons/profile_fill.svg";
// const ProfileFill = Profile;

/* =========================
 * 공통 SVG 래퍼
 * =========================
 * - size / color props 통일
 * - BottomNavigation에서 그대로 사용 가능
 */
const wrapSvg = (SvgComponent) =>
  function Icon({ size = 24, color = "#77777A" }) {
    return <SvgComponent width={size} height={size} color={color} />;
  };

/* =========================
 * export (기본 / fill)
 * ========================= */

export const HomeIcon = wrapSvg(Home);
export const HomeIconFill = wrapSvg(HomeFill);

export const ActivityIcon = wrapSvg(Activity);
export const ActivityIconFill = wrapSvg(ActivityFill);

export const CalendarIcon = wrapSvg(Calendar);
export const CalendarIconFill = wrapSvg(CalendarFill);

export const ProfileIcon = wrapSvg(Profile);
export const ProfileIconFill = wrapSvg(ProfileFill);

/* =========================
 * 기타 공용 아이콘들
 * (fill 개념 없는 아이콘)
 * ========================= */

import ArrowLeft from "../../assets/Icons/chevron_left.svg";
import ChevronDown from "../../assets/Icons/chevron_down.svg";
import ChevronRight from "../../assets/Icons/chevron_right.svg";
import Phone from "../../assets/Icons/phone.svg";
import MapPin from "../../assets/Icons/map_pin.svg";
import Clock from "../../assets/Icons/clock.svg";
import CheckBlue from "../../assets/Icons/check_blue.svg";
import Vector from "../../assets/Icons/vector.svg";
import Check from "../../assets/Icons/check.svg";
import Heart from "../../assets/Icons/heart_01.svg";

export const ArrowLeftIcon = wrapSvg(ArrowLeft);
export const ChevronDownIcon = wrapSvg(ChevronDown);
export const ChevronRightIcon = wrapSvg(ChevronRight);
export const PhoneIcon = wrapSvg(Phone);
export const MapPinIcon = wrapSvg(MapPin);
export const ClockIcon = wrapSvg(Clock);
export const CheckIconBlue = wrapSvg(CheckBlue);
export const VectorIcon = wrapSvg(Vector);
export const CheckIcon = wrapSvg(Check);
export const HeartIcon = wrapSvg(Heart);
