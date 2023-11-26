import { useState } from 'react';

const MyComponent = () => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleRadioChange = (event) => {
    const value = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedValues((prevValues) => [...prevValues, value]);
    } else {
      setSelectedValues((prevValues) =>
        prevValues.filter((prevValue) => prevValue !== value)
      );
    }
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          name="myRadio"
          value="1"
          onChange={handleRadioChange}
        />
        Option 1
      </label>
      <label>
        <input
          type="radio"
          name="myRadio"
          value="2"
          onChange={handleRadioChange}
        />
        Option 2
      </label>
      <label>
        <input
          type="radio"
          name="myRadio"
          value="3"
          onChange={handleRadioChange}
        />
        Option 3
      </label>

      <p>Selected Values: {selectedValues.join(', ')}</p>
    </div>
  );
};

export default MyComponent;
