import CryptoES from '@genee/crypto-es';

function _serialize(obj) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = _serialize(obj[i])
        }
        return obj
    } else if (typeof obj === 'object' && obj != null) {
        const sortedKeys = Object.keys(obj).sort()
        for (let i = 0; i < sortedKeys.length; i++) {
            const k = sortedKeys[i]
            obj[k] = _serialize(obj[k])
        }
        return JSON.stringify(obj, sortedKeys)
    }

    return obj
}

/**
 * Serializes a JSON object (not any random JS object).
 *
 * It should be noted that JS objects can have members of
 * specific type (e.g. function), that are not supported
 * by JSON.
 *
 * @param {Object} obj JSON object
 * @returns {String} stringified JSON object.
 */
function serialize(obj) {
    const ser = _serialize(obj)
    return (typeof ser !== 'string') ? JSON.stringify(ser) : ser
}

/**
 * Creates hash of given JSON object.
 *
 * @param {Object} obj JSON object
 * @see #serialize
 */
function digest(obj) {
    const hash = CryptoES.SHA256(serialize(obj))
    return hash.toString(CryptoES.enc.Hex)
}

export { serialize, digest }
