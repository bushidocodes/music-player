import React from 'react';

import type { ChangeEvent } from 'react';

interface FilterInputProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
}

const FilterInput = (props: FilterInputProps) => {

  const handleChange = props.handleChange;
  const inputValue = props.inputValue;

  return (
    <form className='mb-3' style={{marginTop: '20px'}}>
      <input
        onChange={handleChange}
        value={inputValue}
        className='form-control'
        placeholder="Enter artist name"
      />
    </form>
  );
};

export default FilterInput;
