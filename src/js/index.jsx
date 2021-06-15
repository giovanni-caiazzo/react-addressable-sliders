import React from "react";
import ReactDOM from 'react-dom';
import MultiRangeSlider
    from "./MultiRangeSlider";

const App = () => {
    return <MultiRangeSlider init_ranges={[]}/>
}

ReactDOM.render(<App />, document.getElementById('root') || document.getElementById('div'));
