export function getData() {
    return data;
}

const date = new Date();
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;


const data =  [
    {id: 1, 
    title: "Foo",
    date: formattedDate,
    img: "images/dnd-ice.jpg",
    notes: ["Note 1", "Note 2", "Note 3"],
    encounters: ["Encounter 1", "Encounter 2", "Encounter 3"],
    map: ["Map 1", "Map 2"]
    },
    {
    id: 2, 
    title: "Bar",
    date: formattedDate,
    img: "images/dnd-ice.jpg",
    notes: ["Note A", "Note B", "Note C"],
    encounters: ["Encounter A", "Encounter B", "Encounter C"],
    map: ["Map A", "Map B"]
    },
    {id: 3, 
    title: "Baz",
    date: formattedDate,
    img: "images/dnd-ice.jpg",
    notes: ["Note X", "Note Y", "Note Z"],
    encounters: ["Encounter X", "Encounter Y", "Encounter Z"],
    map: ["Map X", "Map Y"]
    }
]