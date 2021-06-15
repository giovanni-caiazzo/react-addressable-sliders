import React from 'react';
import ReactDOM from 'react-dom';
import MultiRangeSlider from './js/MultiRangeSlider';

Object.defineProperty(exports, 'MultiRangeSlider', {
    enumerable: true,
    get: function get() {
        return MultiRangeSlider.default;
    },
});

const App = () => {
    return <MultiRangeSlider init_ranges={[]} />;
};

ReactDOM.render(<App />, document.getElementById('root'));
