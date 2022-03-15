import Realm from 'realm';
import {
    surveyDataDictionaryKeys,
    customerProfileDictionaryKeys,
    qrCodeListDictionaryKeys
} from "./dictionaryKeys";

const SurveyDataSchema = {
    name: "SurveyData",
    primaryKey: "id",
    properties: {
        id: "string",
        templateId: "int",
        templateTypeId: { type: "int", indexed: true },
        version: "string",
        surveyor: "string",
        serviceWorker: "string?",
        surveyorId: "int",
        serviceWorkerId: "int?",
        organizationId: "int",
        additionalInfo: { type: "list", objectType: "AdditionalInfo", default: [] },
        surveyStartedAt: "string",
        surveyFinishedAt: "string?",
        completed: { type: "bool", indexed: true, default: false },
        online: "bool?",
        lastVisitedFragment: "string?",
        currentDynamicQuestionFragment: "string?",
        connectedQuestionsToShow: { type: "list", objectType: "string", default: [] },
        retainInactiveOptions: "bool?",
        waitingForSync: { type: "bool", indexed: true, default: false },
        synced: { type: "bool", default: false },
        createdBy: "string?",
        createdAt: "string?",
        lastModifiedBy: "string?",
        lastModifiedAt: "string?",
        ...surveyDataDictionaryKeys
    }
};

const SurveyDataReadOnlySchema = {
    name: "SurveyDataReadOnly",
    primaryKey: SurveyDataSchema.primaryKey,
    properties: SurveyDataSchema.properties
};

const AdditionalInfoSchema = {
    name: "AdditionalInfo",
    embedded: true,
    properties: {
        key: { type: "string", indexed: true },
        value: { type: "mixed", indexed: true }
    }
};

const CustomerProfileSchema = {
    name: "CustomerProfile",
    primaryKey: "qrCode",
    properties: {
        qrCode: "string",
        photoId: "string?",
        customerNumber: { type: "string", indexed: true, optional: true },
        customerEnrollmentId: { type: "string", indexed: true, optional: true },
        residenceCategoryId: "int",
        name: "string?",
        wardId: "int",
        wardNumber: "int",
        ward: "string",
        address: "string?",
        lsgi: "string",
        propertyName: "string",
        phone: "string?",
        location: "Location?",
        payments: { type: "list", objectType: "Payment", default: [] },
        ...customerProfileDictionaryKeys
    }
};

const LocationSchema = {
    name: "Location",
    embedded: true,
    properties: {
        latitude: "double?",
        longitude: "double?",
        formattedAddress: "string?"
    }
};

const PaymentSchema = {
    name: "Payment",
    embedded: true,
    properties: {
        paymentConfigId: "int",
        serviceConfigId: "int",
        specialService: "bool",
        advance: "double",
        outstanding: "double"
    }
};

const QrCodeListSchema = {
    name: "QrCodeList",
    primaryKey: "customerEnrollmentId",
    properties: {
        customerEnrollmentId: "string",
        ...qrCodeListDictionaryKeys
    }
};

const ServiceSchema = {
    name: "Service",
    primaryKey: "id",
    properties: {
        id: "int",
        name: "string",
        icon: "string?",
    }
};

const ComplaintSchema = {
    name: "Complaint",
    primaryKey: "id",
    properties: {
        id: "int",
        name: "string",
        icon: "string?",
    }
};

const PaymentConfigSchema = {
    name: "PaymentConfig",
    primaryKey: "id",
    properties: {
        id: "int",
        specialService: "bool",
        serviceType: "GeneralResponse",
        collectionType: "GeneralResponse",
        rateType: "GeneralResponse",
        fixedAmount: "double?",
        perUnitAmount: "double?",
        slabs: { type: "list", objectType: "Slab", default: [] }
    }
};

const GeneralResponseSchema = {
    name: "GeneralResponse",
    embedded: true,
    properties: {
        id: { type: "int", indexed: true },
        name: "string"
    }
}

const SlabSchema = {
    name: "Slab",
    embedded: true,
    properties: {
        ...GeneralResponseSchema.properties,
        startVal: "int",
        endVal: "int",
        pricePerUnit: { type: "double", default: 0 }
    }
};

const InvoiceSchema = {
    name: "Invoice",
    primaryKey: "invoiceNumber",
    properties: {
        id: "int?",
        invoiceNumber: "string",
        customerNumber: { type: "string", indexed: true },
        invoiceIntervalId: "int",
        invoiceDate: "date",
        invoicePeriod: "string",
        dueDate: "date",
        totalPayable: { type: "double", default: 0 },
        netPayable: { type: "double", default: 0 },
        totalPaid: { type: "double", default: 0 },
        outstandingAfterInvoiceGeneration: { type: "double", default: 0 },
        outstandingAfterLastPayment: "double?",
        advanceAfterInvoiceGeneration: { type: "double", default: 0 },
        advanceAfterLastPayment: "double?",
        invoicePaymentStatusId: "int",
        invoicePaymentLastTransactionStatusId: "int?",
        status: { type: "int", default: 1 },
        extraAmount: "double?",
        summary: "InvoiceSummary",
        paymentHistory: { type: "list", objectType: "InvoicePaymentHistory", default: [] },
        metadata: "InvoiceMetadata"
    }
};

const InvoiceSummarySchema = {
    name: "InvoiceSummary",
    embedded: true,
    properties: {
        id: "int?",
        invoiceId: "int?",
        paymentConfigId: "int",
        serviceConfigId: "int",
        subscribedFrom: "date?",
        subscribedTo: "date?",
        status: { type: "int", default: 1 },
        serviceExecutionId: { type: "int", indexed: true, optional: true },
        collectionTypeId: { type: "int", indexed: true },
        rateTypeId: "int",
        fixedAmount: "double?",
        perUnitAmount: "double?",
        slabs: { type: "list", objectType: "Slab", default: [] }
    }
};

const InvoicePaymentHistorySchema = {
    name: "InvoicePaymentHistory",
    embedded: true,
    properties: {
        id: "int?",
        invoiceId: "int?",
        transactedAt: "date",
        amount: { type: "double", default: 0 },
        totalPaidBeforePayment: { type: "double", default: 0 },
        totalPaidAfterPayment: { type: "double", default: 0 },
        outstandingBeforePayment: { type: "double", default: 0 },
        outstandingAfterPayment: { type: "double", default: 0 },
        advanceBeforePayment: { type: "double", default: 0 },
        advanceAfterPayment: { type: "double", default: 0 },
        isAccounted: "bool",
        paidBy: "int",
        invoicePaymentTypeId: "int",
        paymentGatewayId: "int?",
        paymentGatewayRequestBody: "string?",
        paymentGatewayResponseBody: "string?",
        paymentGatewayRefId: "int?",
        invoicePaymentTransactionStatusId: "int",
        status: "int",
        transactionId: "string",
        advance: { type: "double", default: 0 },
        autoSettled: "bool",
        autoSettlementTransactionId: "string?",
        balance: { type: "double", default: 0 }
    }
};

const InvoiceMetadataSchema = {
    name: "InvoiceMetadata",
    embedded: true,
    properties: {
        serviceExecutionDate: "date?",
        quantity: "double?",
        waitingForSync: { type: "bool", indexed: true, default: false }
    }
};

const schemas = [
    SurveyDataSchema,
    SurveyDataReadOnlySchema,
    AdditionalInfoSchema,
    CustomerProfileSchema,
    LocationSchema,
    PaymentSchema,
    QrCodeListSchema,
    ServiceSchema,
    ComplaintSchema,
    PaymentConfigSchema,
    GeneralResponseSchema,
    SlabSchema,
    InvoiceSchema,
    InvoiceSummarySchema,
    InvoicePaymentHistorySchema,
    InvoiceMetadataSchema
];

const defaultConfig = { schema: schemas, schemaVersion: 1 };

const container = {
    realm: undefined
};

export default container;

export const getInstance = (encryptionKey) => {
    const encryptedConfig = { ...defaultConfig, path: 'encrypted.realm', encryptionKey };
    if (!Realm.exists(encryptedConfig)) {
        const defaultRealm = new Realm(defaultConfig);
        const newPath = Realm.defaultPath.substring(0, Realm.defaultPath.lastIndexOf("/") + 1) + 'encrypted.realm';
        defaultRealm.writeCopyTo(newPath, encryptionKey);
        defaultRealm.close();
        Realm.deleteFile(defaultConfig);
    }
    container.realm = new Realm(encryptedConfig);
}

export const removeInstance = (encryptionKey) => {
    const encryptedConfig = { ...defaultConfig, path: 'encrypted.realm', encryptionKey };
    const { realm } = container;
    if (realm) {
        realm.close();
        Realm.deleteFile(encryptedConfig);
        container.realm = undefined;
    }
}

export const resetInstance = (encryptionKey) => {
    const encryptedConfig = { ...defaultConfig, path: 'encrypted.realm', encryptionKey };
    if (Realm.exists(encryptedConfig)) {
        const encryptedRealm = new Realm(encryptedConfig);
        const newPath = Realm.defaultPath;
        encryptedRealm.writeCopyTo(newPath);
        encryptedRealm.close();
        Realm.deleteFile(encryptedRealm);
        container.realm = undefined;
    }
}

export {
    SurveyDataSchema, SurveyDataReadOnlySchema, CustomerProfileSchema,
    QrCodeListSchema, ServiceSchema, ComplaintSchema,
    PaymentConfigSchema, InvoiceSchema
};
