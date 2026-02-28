import icone from "./assets/img/favicon_io/apple-touch-icon.png";
function LogoFloating() {
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
