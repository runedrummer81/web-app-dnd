import DiceThrower from "../components/DiceThrower";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { getData } from "../code/data"; // the mockup data

export default function SessionEdit() {
  const navigate = useNavigate();
  const data = getData();

  const params = useParams();

  const sessionId = +params.sessionId; // lav det her til en variabel den er hard coded lige nu for at hjælpe mig

  const session = data.find((s) => s.id === sessionId);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch(`#/sessions/${sessionId}`);
      const data = await res.json();
      setSession(data);
      setNotes(data.notes || "");
    }
    fetchSession();
  }, [sessionId]);

  return (
    <section>
      <section className="flex flex-col">
        <button
          className="py-2 px-4 text-[#DACA89] font-semibold flex "
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="flex flex-row justify-around align-middle">
          {/* Venstre kolonne */}
          <section className="flex flex-col space-x-2 bg-transparent border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded width-2/3  ">
            <label htmlFor="noter">Notes:</label>
            <input
              type="text"
              name="noter"
              placeholder="The journey begins..."
              className="textfelt width-2/3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>

          {/* Højre kolonne */}
          <section className="flex flex-col justify-center space-x-2 bg-transparent ">
            <article className=" border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded">
              <div className="border border-[#DACA89] text-[#DACA89] font-semibold py-2 px-4 rounded">
                <div className="flex justify-between items-center">
                  <h2>Encounters:</h2>
                  <button>Edit</button>
                </div>

                <div className="px-4">
                  {session.encounters.map((enc, index) => (
                    <div key={index} className="encounter-item">
                      <h3>{enc}</h3>
                    </div>
                  ))}
                </div>
              </div>
              <div className="map-list">
                <h2>Maps</h2>
                <div className="flex justify-between items-center px-4 gap-2">
                  <button>+ADD MAP</button>
                  {session.map.map((m, index) => (
                    <div key={index} className="encounter-item">
                      <p>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <div className="flex justify-center gap-4  text-[#DACA89] font-semibold">
              <button>Save session</button>
              <button onClick={() => navigate("/session")}>Run session</button>
            </div>
          </section>
        </div>

        <section className="bottom-nav">
          <DiceThrower />
        </section>
      </section>
    </section>
  );
}
