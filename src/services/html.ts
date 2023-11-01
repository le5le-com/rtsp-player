export function getHtmlText(html: string, trimSpace?: boolean) {
  const text = html.replace(/<[^<>]+>/g, '');
  if (trimSpace) {
    return text.replace(/\s/g, '');
  }

  return text;
}
