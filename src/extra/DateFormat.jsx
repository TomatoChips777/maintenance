function FormatDate(dateString, withTime = true) {
  const date = new Date(dateString);

  let options;

  if (withTime === 'short') {
    options = {
      month: 'long',
      day: 'numeric'
    };
  } else {
    options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(withTime && {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    };
  }

  return date.toLocaleString(undefined, options);
}

export default FormatDate;

// function FormatDate(dateString, withTime = true) {
//     const date = new Date(dateString);
//     const options = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       ...(withTime && {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       })
//     };
//     return date.toLocaleString(undefined, options);
//   }
  
//   export default FormatDate;
  