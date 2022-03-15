import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { surveyDataDictionaryKeys } from '../dictionaryKeys';
import { transformInput, transformOutput } from '../transformationUtil';
import container, { SurveyDataSchema, SurveyDataReadOnlySchema } from '../realm';

export default SurveyDataRepository = {

    findById: (id, useReadOnlySchema) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(Schema.name, id);
        if (!realmObject) {
            return undefined;
        }
        const output = realmObject.toJSON();
        return transformOutput(surveyDataDictionaryKeys, output);
    },

    findBasicDetailsById: (id) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(SurveyDataSchema.name, id);
        if (!realmObject) {
            return undefined;
        }
        const output = {
            completed: realmObject.completed,
            waitingForSync: realmObject.waitingForSync,
            lastModifiedAt: realmObject.lastModifiedAt
        };
        return output;
    },

    findDataSourcesById: (id) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(SurveyDataSchema.name, id);
        if (!realmObject) {
            return undefined;
        }
        return JSON.parse(realmObject.dataSources);
    },

    findPhotoById: (id, photoId) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(SurveyDataSchema.name, id);
        if (!realmObject) {
            return undefined;
        }
        return JSON.parse(realmObject.answers)[photoId];
    },

    findPhotosOf: (input) => {
        const output = {};
        if (_.isEmpty(input)) {
            return output;
        }
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name).filtered(Object.keys(input).map((item) => 'id = "' + item + '"').join(' OR '));
        if (realmObjects.isEmpty()) {
            return output;
        }
        realmObjects.forEach(realmObject => {
            output[realmObject.id] = JSON.parse(realmObject.answers)[input[realmObject.id]];
        });
        return output;
    },

    existsById: (id, useReadOnlySchema) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        const { realm } = container;
        const realmObject = realm.objectForPrimaryKey(Schema.name, id);
        if (realmObject) {
            return true;
        }
        return false;
    },

    isEmpty: (useReadOnlySchema) => {
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        const { realm } = container;
        return realm.objects(Schema.name).isEmpty();
    },

    findByTemplateTypeIdAndSynced: (templateTypeId, synced, sortDescriptor) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        let filtered = realmObjects.filtered('templateTypeId == $0 && synced == $1', templateTypeId, synced);
        if (sortDescriptor) {
            const { descriptor, reverse } = sortDescriptor;
            filtered = filtered.sorted(descriptor, reverse);
        }
        const output = filtered.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(surveyDataDictionaryKeys, output);
    },

    save: (input, useReadOnlySchema) => {
        if (!input) {
            throw "Error: input is empty";
        }
        const { id: inputId, ...rest } = input;
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        let realmObject;
        const { realm } = container;
        realm.write(() => {
            realmObject = realm.create(Schema.name, {
                id: inputId || uuidv4(),
                ...transformInput(surveyDataDictionaryKeys, rest)
            }, Realm.UpdateMode.Modified);
        });
        const output = realmObject.toJSON();
        return transformOutput(surveyDataDictionaryKeys, output);
    },

    saveCustomerProfileSurveyData: (input) => {
        if (_.isEmpty(input)) {
            return;
        }
        const accumulator = [];
        if (Array.isArray(input)) {
            accumulator.push(...input);
        } else {
            accumulator.push(input);
        }
        const { realm } = container;
        realm.write(() => {
            _.forEach(accumulator, (surveyData) => {
                _.forOwn(surveyData, (object) => {
                    // For some template types, 'object' can be instance of Array.
                    // For others 'object' can be instance of Object.
                    if (Array.isArray(object) && object.length) {
                        _.forEach(object, (newItem) => {
                            realm.create(SurveyDataSchema.name, transformInput(surveyDataDictionaryKeys, newItem), Realm.UpdateMode.Modified);
                        });
                    } else if (!_.isEmpty(object)) {
                        const newItem = object;
                        realm.create(SurveyDataSchema.name, transformInput(surveyDataDictionaryKeys, newItem), Realm.UpdateMode.Modified);
                    }
                });
            });
        });
    },

    deleteById: (id, useReadOnlySchema) => {
        if (!id) {
            throw 'Error: id cannot be empty';
        }
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        let deletedId;
        const { realm } = container;
        realm.write(() => {
            const realmObject = realm.objectForPrimaryKey(Schema.name, id);
            if (realmObject) {
                deletedId = realmObject.id;
                realm.delete(realmObject);
            }
        });
        return deletedId;
    },

    deleteByTemplateTypeIdAndCompleted: (templateTypeId, completed) => {
        let deletedIds;
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(SurveyDataSchema.name);
            const filtered = realmObjects.filtered('templateTypeId == $0 && completed == $1', templateTypeId, completed);
            if (filtered.length) {
                deletedIds = filtered.map(item => item.id);
                realm.delete(filtered);
            }
        });
        return deletedIds;
    },

    findByWaitingForSync: (waitingForSync, sortDescriptor) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        let filtered = realmObjects.filtered('waitingForSync == $0', waitingForSync);
        if (sortDescriptor) {
            const { descriptor, reverse } = sortDescriptor;
            filtered = filtered.sorted(descriptor, reverse);
        }
        const output = filtered.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(surveyDataDictionaryKeys, output);
    },

    existsByWaitingForSync: (waitingForSync) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        let filtered = realmObjects.filtered('waitingForSync == $0', waitingForSync);
        return !filtered.isEmpty();
    },

    findByTemplateTypeIdAndAdditionalInfo: (templateTypeId, additionalInfo) => {
        if (!Array.isArray(additionalInfo)) {
            throw 'Error: additionalInfo must be of type array';
        }
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        const predicate1 = '(templateTypeId == ' + templateTypeId + ')';
        const predicate2 = additionalInfo.map((item) => '(ANY additionalInfo.key == "' + item.key + '" && additionalInfo.value == ' + JSON.stringify(item.value) + ')');
        const filtered = realmObjects.filtered([predicate1, ...predicate2].join(' AND '));
        const length = filtered.length;
        if (length > 1) {
            throw 'Error: Query expected to return 0 or 1 record but received ' + length + 'records';
        } else if (filtered.isEmpty()) {
            return undefined;
        } else {
            const realmObject = filtered[0];
            const output = {
                id: realmObject.id,
                completed: realmObject.completed
            };
            return output;
        }
    },

    countByTemplateTypeIdAndCompletedAndSynced: (templateTypeId, completed, synced) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        const filtered = realmObjects.filtered('templateTypeId == $0 && completed == $1 && synced == $2', templateTypeId, completed, synced);
        return filtered.length;
    },

    findByTemplateTypeId: (templateTypeId) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        const filtered = realmObjects.filtered('templateTypeId == $0', templateTypeId);
        const output = filtered.toJSON();
        return _.isEmpty(output) ? undefined : transformOutput(surveyDataDictionaryKeys, output);
    },

    existsByCompleted: (completed) => {
        const { realm } = container;
        const realmObjects = realm.objects(SurveyDataSchema.name);
        const filtered = realmObjects.filtered('completed == $0', completed);
        return !filtered.isEmpty();
    },

    deleteAll: (useReadOnlySchema) => {
        const Schema = useReadOnlySchema ? SurveyDataReadOnlySchema : SurveyDataSchema;
        const { realm } = container;
        realm.write(() => {
            const realmObjects = realm.objects(Schema.name);
            realm.delete(realmObjects);
        });
    }

};
