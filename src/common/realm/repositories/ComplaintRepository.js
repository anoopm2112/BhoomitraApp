import Realm from 'realm';
import _ from 'lodash';
import container, { ComplaintSchema } from '../realm';

export default ComplaintRepository = {
    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(ComplaintSchema.name, {
                input
            }, Realm.UpdateMode.Modified);
        });
        const output = realmObject.toJSON();
        return output;
    },

    saveAll: (input) => {
        if (!Array.isArray(input)) {
            throw "Error: input is empty or not an array";
        }
        const { realm } = container;
        realm.write(() => {
            input.forEach(item => {
                realm.create(ComplaintSchema.name, item, Realm.UpdateMode.Modified);
            });
        });
        return input.length;
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(ComplaintSchema.name);
        const output = realmObjects.toJSON();
        return _.isEmpty(output) ? undefined : output;
    },
};
