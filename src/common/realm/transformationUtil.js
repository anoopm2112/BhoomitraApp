import _ from 'lodash';

const transformInput = (dictionaryKeys, input) => {
    if (Array.isArray(input)) {
        const accumulator = [];
        input.forEach(item => {
            accumulator.push(transformInput(dictionaryKeys, item));
        });
        return accumulator;
    }
    const transformedInput = _.transform(input, (result, value, key) => {
        if (dictionaryKeys.hasOwnProperty(key)) {
            result[key] = JSON.stringify(value);
        } else {
            result[key] = value;
        }
    }, {});
    return transformedInput;
}

const transformOutput = (dictionaryKeys, output) => {
    if (Array.isArray(output)) {
        const accumulator = [];
        output.forEach(item => {
            accumulator.push(transformOutput(dictionaryKeys, item));
        });
        return accumulator;
    }
    const transformedOutput = _.transform(output, (result, value, key) => {
        if (dictionaryKeys.hasOwnProperty(key)) {
            result[key] = JSON.parse(value);
        } else {
            result[key] = value;
        }
    }, {});
    return transformedOutput;
}

export { transformInput, transformOutput };
