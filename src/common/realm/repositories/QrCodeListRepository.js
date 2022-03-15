import Realm from 'realm';
import _ from 'lodash';
import { qrCodeListDictionaryKeys } from '../dictionaryKeys';
import { transformInput, transformOutput } from '../transformationUtil';
import container, { QrCodeListSchema } from '../realm';

export default QrCodeListRepository = {

    findByCustomerEnrollmentId: (customerEnrollmentId) => {
        if (!customerEnrollmentId) {
            throw 'Error: customerEnrollmentId cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(QrCodeListSchema.name, customerEnrollmentId);
        if (!realmObject) {
            return undefined;
        }
        const output = realmObject.toJSON();
        return transformOutput(qrCodeListDictionaryKeys, output);
    },

    existsByCustomerEnrollmentId: (customerEnrollmentId) => {
        if (!customerEnrollmentId) {
            throw 'Error: customerEnrollmentId cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(QrCodeListSchema.name, customerEnrollmentId);
        if (realmObject) {
            return true;
        }
        return false;
    },

    isEmpty: () => {
        const { realm } = container;
        return realm.objects(QrCodeListSchema.name).isEmpty();
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(QrCodeListSchema.name);
        const output = realmObjects.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(qrCodeListDictionaryKeys, output);
    },

    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(QrCodeListSchema.name, {
                ...transformInput(qrCodeListDictionaryKeys, input)
            }, Realm.UpdateMode.Modified);
        });
        const output = realmObject.toJSON();
        return transformOutput(qrCodeListDictionaryKeys, output);
    },

    deleteByCustomerEnrollmentIdIn: (customerEnrollmentIds) => {
        if (!Array.isArray(customerEnrollmentIds)) {
            throw 'Error: customerEnrollmentIds is not an array';
        }
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(QrCodeListSchema.name).filtered(customerEnrollmentIds.map((item) => 'customerEnrollmentId = "' + item + '"').join(' OR '));
            realm.delete(realmObjects);
        });
    },

    deleteAll: () => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(QrCodeListSchema.name);
            realm.delete(realmObjects);
        });
    }

};
