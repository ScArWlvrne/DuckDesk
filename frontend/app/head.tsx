export default function Head() {
  // Small square SVG favicon encoded as a data URL (UO green with a white 'O')
  // This avoids changing binary files and ensures a square favicon in browsers.
  const href = "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Crect%20width='64'%20height='64'%20fill='%23007030'/%3E%3Ctext%20x='32'%20y='40'%20font-size='36'%20font-family='Arial'%20fill='white'%20text-anchor='middle'%20dominant-baseline='middle'%3EO%3C/text%3E%3C/svg%3E";

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={href} />
      <link rel="apple-touch-icon" href={href} />
    </>
  );
}
