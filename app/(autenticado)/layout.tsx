import Header from "@/componentes/header/Header";
import MenuLateral from "@/componentes/menu-lateral/MenuLateral";
import Rodape from "@/componentes/rodape/Rodape";

export default function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <Header />

      <div id="app-sidepanel" className="app-sidepanel">
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <MenuLateral />
      </div>

      <div className="app-wrapper">
        <div className="app-content pt-3 p-md-3 p-lg-4">
          <div className="container-xl">
            <main>{children}</main>
          </div>
        </div>

        <footer className="app-footer">
          <div className="container text-center py-3">
            <Rodape />
          </div>
        </footer>
      </div>
    </div>
  );
}
