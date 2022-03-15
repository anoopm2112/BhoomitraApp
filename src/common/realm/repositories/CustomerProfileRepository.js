import Realm from 'realm';
import _ from 'lodash';
import { customerProfileDictionaryKeys } from '../dictionaryKeys';
import { transformInput, transformOutput } from '../transformationUtil';
import container, { CustomerProfileSchema } from '../realm';

const PAYMENT_TYPE = {
    ADVANCE: 1,
    OUTSTANDING: 2
};

const applyPaymentOffset = (customerNumber, paymentConfigId, serviceConfigId, offset, paymentType) => {
    const { realm } = container;
    realm.write(() => {
        const realmObjects = realm.objects(CustomerProfileSchema.name)
            .filtered('customerNumber == $0', customerNumber);
        const length = realmObjects.length;
        if (length !== 1) {
            throw 'Error: Query expected 1 record but received ' + length + 'records';
        }
        const realmObject = realmObjects[0];
        const { payments } = realmObject;
        const payment = _.find(payments, { paymentConfigId, serviceConfigId });
        if (paymentType === PAYMENT_TYPE.ADVANCE) {
            payment.advance = payment.advance + offset;
        } else if (paymentType === PAYMENT_TYPE.OUTSTANDING) {
            payment.outstanding = payment.outstanding + offset;
        }
        realm.create(CustomerProfileSchema.name, realmObject, Realm.UpdateMode.Modified);
    });
}

export default CustomerProfileRepository = {

    findByQrCode: (qrCode) => {
        if (!qrCode) {
            throw 'Error: qrCode cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(CustomerProfileSchema.name, qrCode);
        if (!realmObject) {
            return undefined;
        }
        const output = realmObject.toJSON();
        return transformOutput(customerProfileDictionaryKeys, output);
    },

    existsByQrCode: (qrCode) => {
        if (!qrCode) {
            throw 'Error: qrCode cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(CustomerProfileSchema.name, qrCode);
        if (realmObject) {
            return true;
        }
        return false;
    },

    isEmpty: () => {
        const { realm } = container;
        return realm.objects(CustomerProfileSchema.name).isEmpty();
    },

    findByCustomerEnrollmentId: (customerEnrollmentId) => {
        const { realm } = container;
        const realmObjects = realm.objects(CustomerProfileSchema.name);
        const filtered = realmObjects.filtered('customerEnrollmentId == $0', customerEnrollmentId);
        const length = filtered.length;
        if (length > 1) {
            throw 'Error: Query expected to return 0 or 1 record but received ' + length + 'records';
        }
        const output = filtered.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(customerProfileDictionaryKeys, output[0]);
    },

    findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId: (customerNumber, paymentConfigId, serviceConfigId) => {
        const { realm } = container;
        const realmObjects = realm.objects(CustomerProfileSchema.name)
            .filtered('customerNumber == $0', customerNumber);
        const length = realmObjects.length;
        if (length !== 1) {
            throw 'Error: Query expected 1 record but received ' + length + 'records';
        }
        const realmObject = realmObjects[0];
        const { payments } = realmObject;
        const payment = _.find(payments, { paymentConfigId, serviceConfigId });
        return payment;
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(CustomerProfileSchema.name);
        const output = realmObjects.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(customerProfileDictionaryKeys, output);
    },

    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(CustomerProfileSchema.name, {
                ...transformInput(customerProfileDictionaryKeys, input)
            }, Realm.UpdateMode.Modified);
        });
        const output = realmObject.toJSON();
        return transformOutput(customerProfileDictionaryKeys, output);
    },

    saveAll: (input) => {
        if (!Array.isArray(input)) {
            throw "Error: input is empty or not an array";
        }
        const transformedInputs = transformInput(customerProfileDictionaryKeys, input);
        const { realm } = container;
        realm.write(() => {
            transformedInputs.forEach(item => {
                realm.create(CustomerProfileSchema.name, item, Realm.UpdateMode.Modified);
            });
        });
        return transformedInputs.length;
    },

    applyAdvanceOffset: (customerNumber, paymentConfigId, serviceConfigId, offset) => {
        applyPaymentOffset(customerNumber, paymentConfigId, serviceConfigId, offset, PAYMENT_TYPE.ADVANCE);
    },

    applyOutstandingOffset: (customerNumber, paymentConfigId, serviceConfigId, offset) => {
        applyPaymentOffset(customerNumber, paymentConfigId, serviceConfigId, offset, PAYMENT_TYPE.OUTSTANDING);
    },

    deleteByQrCode: (qrCode) => {
        if (!qrCode) {
            throw 'Error: qrCode cannot be empty';
        }
        let deletedQrCode;
        const { realm } = container;
        realm.write(() => {
            const realmObject = realm.objectForPrimaryKey(CustomerProfileSchema.name, qrCode);
            if (realmObject) {
                deletedQrCode = realmObject.qrCode;
                realm.delete(realmObject);
            }
        });
        return deletedQrCode;
    },

    deleteAll: () => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(CustomerProfileSchema.name);
            realm.delete(realmObjects);
        });
    },

    getServicePendingCount: () => {
        let count = 0;
        const { realm } = container;
        const realmObjects = realm.objects(CustomerProfileSchema.name);
        if (realmObjects.isEmpty()) {
            return count;
        }
        realmObjects.forEach(realmObject => {
            const services = JSON.parse(realmObject.services);
            _.forOwn(services, (groupedServices, serviceExecutionData) => {
                if (!_.isEmpty(groupedServices)) {
                    count = count + groupedServices.length;
                }
            });
        });
        return count;
    },

    getComplaintPendingCount: () => {
        let count = 0;
        const { realm } = container;
        const realmObjects = realm.objects(CustomerProfileSchema.name);
        if (realmObjects.isEmpty()) {
            return count;
        }
        realmObjects.forEach(realmObject => {
            const complaints = JSON.parse(realmObject.complaints);
            _.forOwn(complaints, (groupedcomplaints) => {
                if (!_.isEmpty(groupedcomplaints)) {
                    count = count + groupedcomplaints.length;
                }
            });
        });
        return count;
    },

    createSpecialServicePaymentIfNotPresent: (customerNumber, paymentConfigId, serviceConfigId) => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(CustomerProfileSchema.name)
                .filtered('customerNumber == $0', customerNumber);
            const length = realmObjects.length;
            if (length !== 1) {
                throw 'Error: Query expected 1 record but received ' + length + 'records';
            }
            const realmObject = realmObjects[0];
            const { payments } = realmObject;
            const payment = _.find(payments, { paymentConfigId, serviceConfigId });
            if (_.isNil(payment)) {
                payments.push({
                    paymentConfigId,
                    serviceConfigId,
                    specialService: true,
                    advance: 0,
                    outstanding: 0
                });
                realm.create(CustomerProfileSchema.name, realmObject, Realm.UpdateMode.Modified);
            }
        });
    }

};
