module.exports = {
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less|scss|sass)$': '<rootDir>/test/__mocks__/styleMock.js',
    },
    roots: ['<rootDir>/test'],
    testRegex: '((\\.|/)(test|spec))\\.ts?$',
    transform: {
        '^.+\\.tsx?$': ['ts-jest'],
        '^.+\\.ts?$': ['ts-jest'],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
