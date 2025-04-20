function TextTruncate({ text, maxLength = 2, fallback = "No description provided" }) {
    if (!text) return <span className="text-muted">{fallback}</span>;
  
    const truncated =
      text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  
    return <span>{truncated}</span>;
  }
  
  export default TextTruncate;
  