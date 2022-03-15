import Realm from 'realm';
import _ from 'lodash';
import container, { ServiceSchema } from '../realm';

export default ServiceRepository = {

    isEmpty: () => {
        const { realm } = container;
        return realm.objects(ServiceSchema.name).isEmpty();
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(ServiceSchema.name);
        const output = realmObjects.toJSON();
        return _.isEmpty(output) ? undefined : output;
    },

    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(ServiceSchema.name, {
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
                realm.create(ServiceSchema.name, item, Realm.UpdateMode.Modified);
            });
        });
        return input.length;
    },

    deleteAll: () => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(ServiceSchema.name);
            realm.delete(realmObjects);
        });
    }

};
