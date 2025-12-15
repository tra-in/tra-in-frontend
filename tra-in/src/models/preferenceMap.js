export const preferenceToKorean = (key) => {
  switch (key) {
    case "RELAXATION":
      return "힐링";
    case "ACTIVITY":
      return "액티비티";
    case "FOOD":
      return "맛집";
    case "SHOPPING":
      return "쇼핑";
    case "NATURE":
      return "자연";
    case "CULTURE":
      return "문화";
    default:
      return null;
  }
};
