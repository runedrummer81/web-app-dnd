import Nav from "../components/Nav";
import SessionComp from "../components/SessionComp";
import { useNavigate } from "react-router";

export default function Session({ title }) {

  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <Nav />
      </nav>
      <section className="chooseSess">
        <button className="addSess" onClick={() =>navigate("/session-edit")}>+ New Session</button>
        <div>
          <h2>Choose a session</h2>
          <SessionComp
            nr="1"
            date="12/12-2024"
            title="The Beginning"
            img="images/dnd-ice.jpg"
          />
        </div>
      </section>
      <section className="curentSess">
        <h1>{title}</h1>
        <div>
            <p>{notes}</p>
            <div className="encounterNote">
                <p>{encounter}</p>
            </div>
            <div className="mapNote">
                <p>{map}</p>
            </div>
        </div>
      </section>
    </div>
  );
}
