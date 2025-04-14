function FormatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        hour12: true
    };
    return date.toLocaleString(undefined, options);
}

export default FormatDate;