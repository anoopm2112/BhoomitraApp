import _ from 'lodash';

export function removeDups(data) {
    let dedupedData = [];
    if (data && data.length) {
        dedupedData = data.filter((item, index, self) =>
            index === self.findIndex((t) => (
                (t.id && t.id === item.id) ||
                (t.transactionHash && t.transactionHash === item.transactionHash)
            ))
        );
    }
    return dedupedData;
}

export function getFilterLabel(filters = [], value) {
    return value ? (_.find(filters, filter => {
        return value === (filter.value || filter.key);
    }) || {}).label : null;
}