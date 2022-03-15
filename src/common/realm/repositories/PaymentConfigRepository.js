import Realm from 'realm';
import _ from 'lodash';
import container, { PaymentConfigSchema } from '../realm';

export default PaymentConfigRepository = {

    isEmpty: () => {
        const { realm } = container;
        return realm.objects(PaymentConfigSchema.name).isEmpty();
    },

    findById: (paymentConfigId) => {
        if (!paymentConfigId) {
            throw 'Error: paymentConfigId cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(PaymentConfigSchema.name, paymentConfigId);
        return realmObject ? realmObject.toJSON() : undefined;
    },

    isSpecialService: (paymentConfigId) => {
        if (!paymentConfigId) {
            throw 'Error: paymentConfigId cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(PaymentConfigSchema.name, paymentConfigId);
        return realmObject ? realmObject.specialService : undefined;
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(PaymentConfigSchema.name);
        if (realmObjects.isEmpty()) {
            return;
        }
        const output = realmObjects.toJSON();
        return output;
    },

    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        const { realm } = container;
        realm.write(() => {
            realm.create(PaymentConfigSchema.name, input, Realm.UpdateMode.Modified);
        });
    },

    saveAll: (input) => {
        if (!Array.isArray(input)) {
            throw "Error: input is empty or not an array";
        }
        const { realm } = container;
        realm.write(() => {
            input.forEach(item => {
                realm.create(PaymentConfigSchema.name, item, Realm.UpdateMode.Modified);
            });
        });
    },

    deleteAll: () => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(PaymentConfigSchema.name);
            realm.delete(realmObjects);
        });
    }

};
