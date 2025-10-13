
import DiceThrower from "../components/DiceThrower";

export default function SessionEdit(){
    return (
            <>
                <section className="grid grid-cols-2">
      {/* Venstre kolonne */}
                    <div className="flex flex-col space-y-6">
                        <input type="text" className="textfelt"/>
                    </div>

      {/* Højre kolonne */}
                    <article className="premade-encounter-ow-boks">
                        <h3>Encounters</h3>
                        <button>Adjust</button>
                        <div className="encounter-list"></div>
                    </article>
                    <article className="maps">
                        <button className="add-map">+</button>
                        <div className="map-list"></div>
                    </article>
                </section>
                <section className="bottom-nav">
                    <DiceThrower />
                    <button onClick={() =>navigate("/session")}>Back</button>
                    <button onClick={() =>navigate("/session")}>Save</button>

                </section>
                
            </>
    );
}