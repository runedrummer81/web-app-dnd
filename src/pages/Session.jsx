import { getData } from "../code/data";
import SessionComp from "../components/SessionComp";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Session() {
  const navigate = useNavigate();
  const data = getData();
  const [selectedSession, setSelectedSession] = useState(null);

  function handleSelectSession(session) {
    if (selectedSession === session) {
      setSelectedSession(null);
    } else {
      setSelectedSession(session);
    }
  }

  return (
    <div>
      <section className="chooseSess">
        <h2>Choose a session</h2>
        <button className="addSess" onClick={() => navigate("/session-edit")}>
          + New Session
        </button>
        {/* Make this inverted, prob med et fetch kald eller data manipulation. */}
        <div>
          {data.map((session) => (
            <button
              key={session.id}
              className="sessSelector"
              onClick={() => handleSelectSession(session)}
            >
              <SessionComp data={session} />
            </button>
          ))}
        </div>
      </section>

      {selectedSession && (
        <section className="curentSess">
          <div className="info">
            <h2>{selectedSession.title}</h2>
            <p>{selectedSession.notes}</p>

            <div>
              <div className="encounterNote">
                {selectedSession.encounters?.map((enc, i) => (
                  <p key={i}>{enc}</p>
                ))}
              </div>

              <div className="mapNote">
                {selectedSession.map && <p>{selectedSession.map}</p>}
              </div>
            </div>

            <button
              className="addSess"
              onClick={() => navigate("/session-edit")}
            >
              Change
            </button>
            <button
              className="addSess"
              onClick={() => navigate("/session-edit")}
            >
              Run Session
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
