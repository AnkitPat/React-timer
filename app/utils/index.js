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
  return `${formatNumber(hrs)}:${formatNumber(min)}:${formatNumber(sec)}`;
}

export function formatNumber(number) {
  return `0${number}`.slice(-2);
}

export const translateLanguage = (intl, languageKey) =>
  intl.formatMessage({
    id: languageKey,
  });

export const timeDifference = (start, end) =>
  msConversion(Math.abs(new Date(start) - new Date(end)));

export const addTimes = timers => {
  const times = [0, 0, 0];
  const max = times.length;

  for (let j = 0; j < timers.length; j = j +1) {
    const b = (timers[j] || '').split(':');

    // normalize time values
    for (let i = 0; i < max; i = i + 1) {
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
    }

    // store time values
    for (let i = 0; i < max; i = i +1) {
      times[i] = times[i] + b[i];
    }
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
};

export const substractTimes = (total, time) => {
  const times = [0, 0, 0];
  const max = times.length;

  const a = (total || '').split(':');
  const b = (time || '').split(':');
  for (var i = 0; i < max; i = i + 1) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var i = 0; i < max; i = i+ 1) {
    times[i] = a[i] - b[i];
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
};
