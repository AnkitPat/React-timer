export const formatDate = date => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};

export const formatTime = date => {
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const getCurrentAmPm = hour >= 12 ? 'PM' : 'AM';
  hour %= 12;
  hour = hour || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formatNumber(hour)}:${formatNumber(minutes)}:${formatNumber(
    seconds,
  )} ${getCurrentAmPm}`;
};

export const differenceOfTime = (startDate, endDate) => {
  const diffDays = Math.abs(
    new Date(endDate).getTime() - new Date(startDate).getTime(),
  );

  return msConversion(diffDays);
};

export function msConversion(millis) {
  let sec = Math.round(millis / 1000);
  const hrs = Math.round(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.round(sec / 60);
  sec -= min * 60;

  sec = `${sec}`;
  sec = `00${sec}`.substring(sec.length);

  if (hrs > 0) {
    min = `${min}`;
    min = `00${min}`.substring(min.length);
    return `${formatNumber(hrs)}:${formatNumber(min)}:${formatNumber(sec)}`;
  }
  return `${formatNumber(min)}:${formatNumber(sec)}`;
}

export function formatNumber(number) {
  return `0${number}`.slice(-2);
}
