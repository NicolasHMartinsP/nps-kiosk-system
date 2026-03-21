/* LogoFloating.jsx — Logo fixo com scroll suave ao topo. Documentação: README.md → Componentes → LogoFloating.jsx */

import icone from "../assets/img/favicon_io/android-chrome-512x512.png";
import "../styles/LogoFloating.css";
function LogoFloating() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
