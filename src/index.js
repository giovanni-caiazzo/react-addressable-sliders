import React from 'react';
import ReactDOM from 'react-dom';
import MultiRangeSlider from './js/MultiRangeSlider';

const App = () => {
    return <MultiRangeSlider init_ranges={[]} />;
};

ReactDOM.render(<App />, document.getElementById('root'));
