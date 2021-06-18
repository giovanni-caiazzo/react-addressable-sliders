import React from 'react';

// component under test
import { getClickedValueOnTrack } from '../../src/js/utils';

describe('Testing getClickedValueOnTrack', () => {
    beforeEach(cb => {
        jest.restoreAllMocks();
        cb();
    });

    afterEach(cb => {
        cb();
    });

    it('gives the extremes as closestRanges when no ranges have been created', () => {
        const syntethic_event = { clientX: 650, target: { clientWidth: 1993, offsetLeft: 8 } };
        const extremes = { max: 1623567610, min: 1541503236 };
        const result = getClickedValueOnTrack(syntethic_event, extremes, {});
        expect(result.closestRanges).toStrictEqual(extremes);
    });

    it('gives the correct closestRanges when given ranges', () => {
        const syntethic_event = { clientX: 650, target: { clientWidth: 1993, offsetLeft: 8 } };
        const extremes = { max: 1623567610, min: 1541503236 };
        const ranges = {
            '7d066825-fc8f-4615-884c-463eb34a0ee1': {
                created: 1623570583131,
                id: '7d066825-fc8f-4615-884c-463eb34a0ee1',
                kwh: 1008.707,
                max: 1596278041,
                min: 1573000274,
                name: 'Ardmore Shipping',
                parent_id: 'CEDC88',
                ref_id: 'dba06e6f-cf48-43f6-8087-a824d6deb0ce',
                updated: 1623570583131,
                actualTrackColor: '#CEDC88',
            },
            '32312724-f317-4569-9dd5-6de9e788b149': {
                created: 1623570583164,
                id: '32312724-f317-4569-9dd5-6de9e788b149',
                kwh: 1000.054,
                max: 1623567610,
                min: 1598957385,
                name: 'Ardmore Shipping',
                parent_id: 'CEDC88',
                ref_id: 'dba06e6f-cf48-43f6-8087-a824d6deb0ce',
                updated: 1623570583164,
                immovable: {
                    right: true,
                },
                actualTrackColor: '#CEDC88',
            },
            '9db7ad00-7868-4658-8b42-dc1bf5d04095': {
                created: 1623570580601,
                id: '9db7ad00-7868-4658-8b42-dc1bf5d04095',
                kwh: 9.06,
                max: 1572606140,
                min: 1572535653,
                name: 'Ardmore Shipping',
                parent_id: 'CEDD7B',
                ref_id: 'dba06e6f-cf48-43f6-8087-a824d6deb0ce',
                updated: 1623570580601,
                actualTrackColor: '#CEDD7B',
            },
            '118024e6-cbca-4bb1-ac2c-9db149a14454': {
                created: 1623570583039,
                id: '118024e6-cbca-4bb1-ac2c-9db149a14454',
                kwh: 100,
                max: 1598956439,
                min: 1596278041,
                name: 'Manual',
                original_device_id: 'CEDC88',
                parent_id: 'Manual',
                ref_id: 'dba06e6f-cf48-43f6-8087-a824d6deb0ce',
                updated: 1623570583039,
                actualTrackColor: '#CCCCCC',
            },
        };
        const result = getClickedValueOnTrack(syntethic_event, extremes, ranges);
        expect(result.closestRanges).toStrictEqual({ max: 1572535653, min: 1541503236 });
    });
});
