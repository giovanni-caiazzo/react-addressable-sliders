import React from 'react';
import ReactDOM from 'react-dom';
import { Thumb, Range } from './js/utils';
import MultiRangeSlider from './js/MultiRangeSlider';

const App = () => {
    const myCallback = (range: Range, newValue: string, thumb: Thumb) => console.log(range, newValue, thumb);
    return (
        <><div style={{ paddingTop: '30px' }}>
            <MultiRangeSlider
                ranges={{
                    'range-id-1': {
                        id: 'range-id-1',
                        max: 10,
                        min: 1,
                        name: 'range-name',
                        parent_id: 'id-of-slider',
                        ref_id: 'id-of-object-represented-by-this-range',
                        trackColor: '#DD2C00',
                    },
                    'range-id-2': {
                        id: 'range-id-2',
                        max: 100,
                        min: 50,
                        name: 'other-range-name',
                        parent_id: 'id-of-slider',
                        ref_id: 'id-of-other-object-represented-by-this-range',
                        immovable: {
                            left: true,
                        },
                    },
                }}
                emitChanges={myCallback}
            />
        </div>
            <div style={{ paddingTop: '60px', paddingLeft: '60px', width: "50vh" }}>
                <MultiRangeSlider
                    options={{isVertical: true}}
                    ranges={{
                        'range-id-1': {
                            id: 'range-id-1',
                            max: 10,
                            min: 1,
                            name: 'vertical-range-name',
                            parent_id: 'id-of-slider',
                            ref_id: 'id-of-object-represented-by-this-range',
                            trackColor: '#DD2C00',
                        },
                        'range-id-2': {
                            id: 'range-id-2',
                            max: 100,
                            min: 50,
                            name: 'vertical-other-range-name',
                            parent_id: 'id-of-slider',
                            ref_id: 'id-of-other-object-represented-by-this-range',
                            immovable: {
                                left: true,
                            },
                        },
                    }}
                    emitChanges={myCallback}
                />
            </div></>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
