export default function SessionComp({nr, date, title, img }) {
    return (
        <div>
            <p>{nr}</p>
            <h2>{title}</h2>
            <p>{date}</p>
            <img src={img} alt={title} />
        </div>
    );
}