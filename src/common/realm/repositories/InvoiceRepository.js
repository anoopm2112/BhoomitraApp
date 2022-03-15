import Realm from 'realm';
import _ from 'lodash';
import container, { InvoiceSchema } from '../realm';

export default InvoiceRepository = {

    isEmpty: () => {
        const { realm } = container;
        return realm.objects(InvoiceSchema.name).isEmpty();
    },

    findByInvoiceNumber(invoiceNumber) {
        if (!invoiceNumber) {
            throw 'Error: invoiceNumber cannot be empty';
        }
        const { realm } = container;
        const realmobject = realm.objectForPrimaryKey(InvoiceSchema.name, invoiceNumber);
        if (realmobject) {
            return realmobject.toJSON();
        }
        return;
    },

    findByServiceExecutionId: (serviceExecutionId) => {
        if (!serviceExecutionId) {
            throw 'Error: serviceExecutionId cannot be empty';
        }
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        const filtered = realmObjects.filtered('summary.serviceExecutionId == $0', serviceExecutionId);
        if (filtered.isEmpty()) {
            return;
        }
        const length = filtered.length;
        if (length > 1) {
            throw 'Error: Query expected to return 0 or 1 record but received ' + length + 'records';
        }
        const realmObject = filtered[0];
        return realmObject.toJSON();
    },

    findAll: () => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        if (realmObjects.isEmpty()) {
            return;
        }
        return realmObjects.toJSON();
    },

    findAllInvoiceIds: () => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        if (realmObjects.isEmpty()) {
            return;
        }
        return realmObjects.map(realmObject => realmObject.id);
    },

    findByCustomerNumberAndCollectionTypeId: (customerNumber, collectionTypeId, sortDescriptor) => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        let filtered = realmObjects.filtered('customerNumber == $0 && summary.collectionTypeId == $1', customerNumber, collectionTypeId);
        if (sortDescriptor) {
            const { descriptor, reverse } = sortDescriptor;
            filtered = filtered.sorted(descriptor, reverse);
        }
        return filtered.toJSON();
    },

    findByCustomerNumberAndInvoicePaymentStatusIdAndPaymentConfigId: (customerNumber, invoicePaymentStatusId, paymentConfigId, sortDescriptor) => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        let filtered = realmObjects.filtered('customerNumber == $0 && invoicePaymentStatusId == $1 && summary.paymentConfigId == $2', customerNumber, invoicePaymentStatusId, paymentConfigId);
        if (sortDescriptor) {
            const { descriptor, reverse } = sortDescriptor;
            filtered = filtered.sorted(descriptor, reverse);
        }
        return filtered.toJSON();
    },

    findInvoiceNumberByWaitingForSync: (waitingForSync) => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        let filtered = realmObjects.filtered('metadata.waitingForSync == $0', waitingForSync);
        if (filtered.isEmpty()) {
            return;
        }
        const output = filtered.map(item => item.invoiceNumber);
        return output;
    },

    findByInvoiceNumberIn: (invoiceNumbers, sortDescriptor) => {
        const { realm } = container;
        const realmObjects = realm.objects(InvoiceSchema.name);
        let filtered = realmObjects.filtered(invoiceNumbers.map((invoiceNumber) => 'invoiceNumber == "' + invoiceNumber + '"').join(' OR '));
        if (sortDescriptor) {
            filtered = filtered.sorted(sortDescriptor);
        }
        return filtered.toJSON();
    },

    updateInvoiceIds: (invoice, invoiceNumber) => {
        const { realm } = container;
        let realmObject;
        realm.write(() => {
            realmObject = realm.objectForPrimaryKey(InvoiceSchema.name, invoiceNumber);
            if (realmObject) {
                if (_.isNull(realmObject.id)) {
                    realmObject.id = invoice.id;
                }
                if (_.isNull(realmObject.summary.id)) {
                    realmObject.summary.id = invoice.summary.id;
                    realmObject.summary.invoiceId = invoice.id;
                }
                if (invoice.hasOwnProperty('paymentHistory')) {
                    const { paymentHistory = [] } = invoice;
                    _.forEach(paymentHistory, (item) => {
                        const entry = _.find(realmObject.paymentHistory, ['transactionId', item.transactionId]);
                        entry.id = item.id;
                        entry.invoiceId = invoice.id;
                    });
                }
                realmObject.metadata.waitingForSync = false;
                realmObject = realm.create(InvoiceSchema.name, realmObject, Realm.UpdateMode.Modified);
            }
        });
    },

    save: (input) => {
        if (!input) {
            throw "Error: input is empty";
        }
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(InvoiceSchema.name, input, Realm.UpdateMode.Modified);
        });
        return realmObject.toJSON();
    },

    saveAll: (collection) => {
        if (!collection) {
            throw "Error: collection is empty";
        }
        const { realm } = container;
        realm.write(() => {
            collection.forEach(input => {
                realm.create(InvoiceSchema.name, input, Realm.UpdateMode.Modified);
            });
        });
        return collection.length;
    },

    deleteByInvoiceNumber: (invoiceNumber) => {
        const { realm } = container;
        realm.write(() => {
            const realmObject = realm.objectForPrimaryKey(InvoiceSchema.name, invoiceNumber);
            realm.delete(realmObject);
        });
    },

    deleteAll: () => {
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(InvoiceSchema.name);
            realm.delete(realmObjects);
        });
    }

};
