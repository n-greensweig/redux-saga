import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const elements = useSelector(store => store.elementList);
  const planetList = useSelector(store => store.planetList);
  const mostWantedList = useSelector(store => store.mostWantedList);
  console.log(mostWantedList);
  const [newElement, setNewElement] = useState('');

  const getElements = () => {
    dispatch({ type: 'FETCH_ELEMENTS' });
  };

  const getPlanets = () => {
    dispatch({ type: 'FETCH_PLANETS' });
  };

  const getMostWanted = () => {
    dispatch({ type: 'FETCH_MOST_WANTED' });
  };

  useEffect(() => {
    getElements();
    getPlanets();
    getMostWanted();
  }, []);

  const addElement = () => {
    dispatch({
      type: 'ADD_ELEMENT',
      payload: { name: newElement }
    });
  }


  return (
    <div>
      <h1>Atomic Elements</h1>

      <ul>
        {elements.map(element => (
          <li key={element}>
            {element}
          </li>
        ))}
      </ul>

      <input
        value={newElement}
        onChange={evt => setNewElement(evt.target.value)}
      />
      <button onClick={addElement}>Add Element</button>

      <h2>Planets</h2>
      <ul>
        {planetList.map(planet => <li key={planet.name}>{planet.name}</li>)}
      </ul>

      <h2>Most Wanted</h2>
      <ul>
        {mostWantedList.map(person => <li key={person.id}>{person}</li>)}
      </ul>
    </div>
  );
}


export default App;
