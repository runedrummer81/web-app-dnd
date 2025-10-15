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
    <div className="flex justify-center space-x-8 p-8 min-h-screen">
      <section className="flex flex-col justify-center w-1/3 space-y-4">
        <h2 className="text-lg uppercase tracking-widest font-semibold text-[#DACA89]">
          Choose a session
        </h2>
        <button
          className="flex flex-row justify-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
          onClick={() => navigate("/session-edit")}
        >
          + New Session
        </button>
        {/* Make this inverted, prob med et fetch kald eller data manipulation. */}
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {data.map((session) => (
            <button
              key={session.id}
             className="flex justify-center gap-x-2 items-center bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition"
              onClick={() => handleSelectSession(session)}
            >
              <SessionComp data={session} />
            </button>
          ))}
        </div>
      </section>
      {/* `flex items-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition`"> */}

      {selectedSession && (
        <section className="flex flex-col justify-center w-1/3 space-y-4 text-[#DACA89]">
          <div className="flex flex-col justify-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition">
            <h2 className="text-lg uppercase tracking-widest font-semibold text-[#DACA89]">
              {selectedSession.title}
            </h2>
            <p className="flex flex-row justify-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition">
              {selectedSession.notes}
            </p>

            <div className="flex flex-row justify-center">
              <div className="flex flex-col justify-center space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded hover:bg-[#DACA89]/10 transition">
                {selectedSession.encounters?.map((enc, i) => (
                  <p key={i}>{enc}</p>
                ))}
              </div>

              <div className="mapNote">
                {selectedSession.map && <p>{selectedSession.map}</p>}
              </div>
            </div>
            <div className="">
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
          </div>
        </section>
      )}
    </div>
  );
}
