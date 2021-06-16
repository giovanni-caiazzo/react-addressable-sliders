# react-addressable-sliders

![npm](https://img.shields.io/npm/v/react-addressable-sliders)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-addressable-sliders?label=minified%20size)

## Description

React Slider with support for multi ranges. Each range has its own id and so can be easily addressed and identified.

## Installation

`yarn add react-addressable-sliders`

## Usage example

```javascript
import React from 'react';
import { MultiRangeSlider } from 'react-addressable-sliders';

const MySlider = () => {
    const myCallback = (range, newValue, thumb) => console.log(range, newValue, thumb);
    return (
        <MultiRangeSlider
            ranges={{
                'range-id-1': {
                    id: 'range-id-1',
                    max: 10,
                    min: 1,
                    name: 'range-name',
                    parent_id: 'id-of-slider',
                    ref_id: 'id-of-object-represented-by-this-range',
                    trackColor: '#DD2C00'
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
                    }
                },
            }}
            emitChanges={myCallback}
        />
    );
};
```

## Props
| Name                  | Required         | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------|----------------- | ----------| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ranges                | `True`           | `Object`  | Define the ranges shown in the slider. Each object must have at least the fields `max` `min` `id`.<br/>The `trackColor` can be used to specify the color of the range's track.<br/>The `ref_id` can be used to reference the id of an object you want to reference.<br/>The `parent_id` can be used in case you need to use multiple sliders and you want them to interact with each other.<br/>`immovable` is an `Object` that has fields `left` and `right`. When they are `True` the respective range extreme cannot be moved. |
| extremes              | `False`          | `Object`  | Force the extremes of the range to be the ones you specify. This `Object` has two fields: `max` and `min`, they control their respective extreme. |
| emitChanges           | `False`          | `Function`| `(range, newValue, thumb) => Void` This callback fires `onMouseUp`. It lets you update the correct range object: its arguments are: `range` which has the old range data, `newValue`, which is the new value of the range after the change and `thumb`, which can be a string (`max` or `min`) and tells you which extreme was changed.  |
| checkContinuousChanges| `False`          | `Function`| `(range, newValue, thumb) => Void` This callback works the same as `emitChanges` but it fires for every change, also during the sliding of the values. It is handy for checks that cannot be done only `onMouseUp`.  |
| emptySpaceCallback    | `False`          | `Function`| `(clickInfo) => Void` This callback fires when clicking the slider where no range is present.<br/>The argument `clickInfo` has `relativePercentage`, which gives you a number between 0 and 100 that tells you which part of the slider you clicked, `relativeValue`, which tells you the value of the slider at that particular point and `closestRanges` which is an `Object` with fields `min` and `max` which tells you where are the closest ranges' extremes on the left and on the right of the clicked point. |
| labelFormatFun        | `False`          | `Function`| `(value) => formatted_value` With this function you can change the format of the slider values.<br/>For example if you want dates you can use timestamps as the slider value and then set this to `value => moment.utc(value, 'X').format(dateFormatWithTimeShorter)`. |
| options               | `False`          | `Object`  | Lets you configure aspects of the slider with specific keys (see below).|

### options fields

* `getTrackColor` is a function `(range) => hex str` which lets you assign colors to the ranges' track for each range.
* `isImmovable` is a function `(range) => Boolean` which gives you more control on which ranges are immovable. The ranges that return `True` are rendered immovable.
* `rangePadding` is a `Number` that controls by how much at least the ranges have to be separated. Default is 0.
* `sliderValueStyles` is an `Object` that lets you customize the style of the slider values under both extremes.
* `sliderNameStyles` is an `Object` that lets you customize the style of the ranges' name.
* `sliderNamePopupStyles` is an `Object` that lets you customize the style of the ranges' name when they popup `onMouseHover`.
* `sliderThumbStyles` is an `Object` that lets you customize the style of the ranges' thumbs.
