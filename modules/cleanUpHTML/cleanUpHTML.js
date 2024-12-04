export const cleanUpHTML = (html) => {
  // Remove empty tags (including those with only whitespace or &nbsp;)
  html = html.replace(/<(\w+)(\s*[^>]*)>(\s|&nbsp;)*<\/\1>/g, "");

  // Remove duplicate &nbsp;
  html = html.replace(/(&nbsp;){2,}/g, "&nbsp;");

  // Remove unnecessary whitespace
  html = html.replace(/\s{2,}/g, " ");

  // Trim leading and trailing whitespace
  html = html.trim();

  return html;
};
