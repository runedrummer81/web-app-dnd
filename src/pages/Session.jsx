import { getData } from "../code/data";
import SessionComp from "../components/SessionComp";
import { useNavigate } from "react-router";

export default function Session() {
  const navigate = useNavigate();

  const data = getData();

  return (
    <div>
      <section className="chooseSess">
        <button className="addSess" onClick={() => navigate("/session-edit")}>
          + New Session
        </button>
        <div>
          <h2>Choose a session</h2>
          <button className="sessSelector" onClick="sessInfo()">
            {/* Make this inverted, prob med et fetch kald eller data manipulation. */}
            {data.map((session) => (
              <SessionComp
                data={session}
              />
            ))}
          </button>
        </div>
      </section>
      <section className="curentSess">
            
      </section> 
    </div>
  );
}

  {/* <h1>{title}</h1>
        <div>
          <p>{notes}</p>
          <div className="encounterNote">
            <p>{encounters}</p>
            <p>{encounters}</p>
            <p>{encounters}</p>
          </div>
          <div className="mapNote">
            <p>{map}</p>
            <p>{map}</p>
          </div>
        </div> */}