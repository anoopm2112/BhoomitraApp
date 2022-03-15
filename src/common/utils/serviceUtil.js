import { surveyDataLock } from '../../common/locks';
import { SurveyDataRepository } from '../../common/realm/repositories';
import _ from 'lodash';
import AwaitLock from 'await-lock';

export const mergeCustomerProfile = async (existingProfile, newProfile, retainServices, retainComplaints) => {
    const services = newProfile.services;
    const surveyData = newProfile.surveyData;
    const payments = newProfile.payments;
    const complaints = newProfile.complaints;
    delete newProfile.services;
    delete newProfile.surveyData;
    delete newProfile.payments;
    delete newProfile.complaints;
    _.merge(existingProfile, newProfile);
    if (retainServices) {
        if (_.isEmpty(existingProfile.services)) {
            existingProfile.services = services;
        } else {
            if (!_.isEmpty(services)) {
                _.forOwn(services, (servicesIngroup, serviceExecutionDate) => {
                    if (existingProfile.services.hasOwnProperty(serviceExecutionDate)) {
                        existingProfile.services[serviceExecutionDate].push(...servicesIngroup);
                    } else {
                        existingProfile.services[serviceExecutionDate] = servicesIngroup;
                    }
                });
            }
        }
    } else {
        existingProfile.services = services;
    }
    if (retainComplaints) {
        if (_.isEmpty(existingProfile.complaints)) {
            existingProfile.complaints = complaints;
        } else {
            if (!_.isEmpty(complaints)) {
                _.forOwn(complaints, (complaintsIngroup, complaintReportedDate) => {
                    if (existingProfile.complaints.hasOwnProperty(complaintReportedDate)) {
                        existingProfile.complaints[complaintReportedDate].push(...complaintsIngroup);
                    } else {
                        existingProfile.complaints[complaintReportedDate] = complaintsIngroup;
                    }
                });
            }
        }
    } else {
        existingProfile.complaints = complaints;
    }
    if (!_.isEmpty(surveyData)) {
        for (const templateType in surveyData) {
            const object = surveyData[templateType];
            // For some template types, 'object' can be instance of Array.
            // For others 'object' can be instance of Object.
            if (Array.isArray(object) && object.length) {
                for (const newItem of object) {
                    await processSurveyData(newItem);
                }
            } else if (!_.isEmpty(object)) {
                const newItem = object;
                await processSurveyData(newItem);
            }
        }
    }
    const difference = _.xorBy(existingProfile.payments, payments, (item) => {
        return item.paymentConfigId + ' => ' + item.serviceConfigId;
    });
    if (!_.isEmpty(difference)) {
        difference.forEach(entry => {
            if (!_.includes(existingProfile.payments, entry)) {
                existingProfile.payments.push(entry);
            } else if (!entry.specialService) {
                _.remove(existingProfile.payments, entry);
            }
        });
    }
}

const processSurveyData = async (newItem) => {
    surveyDataLock[newItem.id] = surveyDataLock[newItem.id] || new AwaitLock();
    await surveyDataLock[newItem.id].acquireAsync();
    const surveyData = SurveyDataRepository.findBasicDetailsById(newItem.id);
    if (!surveyData || (surveyData.completed && !surveyData.waitingForSync && surveyData.lastModifiedAt !== newItem.lastModifiedAt)) {
        SurveyDataRepository.save(newItem);
    }
    surveyDataLock[newItem.id].release();
    if (!surveyDataLock[newItem.id].acquired) {
        delete surveyDataLock[newItem.id];
    }
}
