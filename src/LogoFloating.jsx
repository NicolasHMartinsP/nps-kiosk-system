/*
  LogoFloating.jsx
  A small component that displays a floating logo in the corner of the
  screen. Clicking the logo smoothly scrolls the browser window to the
  top. Used throughout the app to provide a quick-return button.
*/

import icone from "./assets/img/favicon_io/apple-touch-icon.png";
function LogoFloating() {
  // scrollToTop uses the Window.scrollTo API with smooth behavior.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <img
      src={icone}
      alt="Logo"
      className="logo-floating"
      onClick={scrollToTop}
    />
  );
}
export default LogoFloating;
