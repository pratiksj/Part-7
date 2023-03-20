//import { useState } from "react";
import useField from "./useCounter";
// import useCounter from "./useCounter";
// const App = (props) => {
//   //const [counter, setCounter] = useState(0);
//   const counter = useCounter();
//   const left = useCounter();
//   const right = useCounter();

//   return (
//     <div>
//       <div>{counter.value}</div>
//       <button onClick={counter.increase}>plus</button>
//       {/* <button onClick={() => setCounter(counter - 1)}>minus</button> */}
//       <button onClick={counter.decrease}>minus</button>
//       <button onClick={counter.zero}>zero</button>

//       <div>{left.value}</div>
//       <button onClick={left.increase}>left</button>
//       <button onClick={right.increase}>right</button>
//       <div>{right.value}</div>
//     </div>
//   );
// };
// export default App;
const App = () => {
  //const [name, setName] = useState("");
  const name = useField("text");
  const born = useField("date");
  const height = useField("number");
  //const [born, setBorn] = useState("");
  //const [height, setHeight] = useState("");

  return (
    <div>
      <form>
        name:
        <input {...name} />
        <br />
        birthdate:
        {/* <input type={born.type} value={born.value} onChange={born.onChange} /> */}
        <input {...born} />
        <br />
        height:
        <input
          type={height.type}
          value={height.value}
          onChange={height.onChange}
        />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  );
};

export default App;
