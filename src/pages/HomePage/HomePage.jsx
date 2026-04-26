import logo from "../../assets/tsitools.png";
import "./HomePage.css";
import { mainPages } from "../../assets/pageList";
import { NavLink } from "react-router";
import NavBar from "../../components/NavBar";

export function HomePage() {
  return (
    <>
      <NavBar />
      <div className="content">
        <div className="title">
          <img id="title" src={logo} />
          <div>
            <h1 id="title">TSI Tools</h1>
            <p id="title">For students - by a student</p>
          </div>
        </div>
        <div className="center-0 info">
          <p>
            <a>
              <i className="bi bi-info-circle-fill"></i> Информация о проекте
            </a>
          </p>
        </div>
        <div className="center-0">
          <div className="page-grid">
            {mainPages.map((page) => {
              return (
                <NavLink
                  key={page.id}
                  to={`/${page.path}`}
                  className="page-grid-tile-link"
                >
                  <div className="page-grid-tile">
                    <p className="page-grid-tile-title">
                      {page.icon} {page.title}
                    </p>
                    <p>{page.description}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
