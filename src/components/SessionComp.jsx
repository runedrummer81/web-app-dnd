export default function SessionComp({ data }) {

    

  return (
    <div className="flex flex-row justify-around">
      <p>{data.id}</p>
      <h2>{data.title}</h2>
      <p>{data.date.toString()}</p>
      {/* <img src={data.img} alt={data.title} /> */}
    </div>
  );
}
