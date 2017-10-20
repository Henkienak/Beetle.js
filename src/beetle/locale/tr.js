﻿(function (root, factory) {
    if (typeof exports === "object") {
        var beetle = require("./beetle.js");
        module.exports = factory(root, beetle);
        return beetle;
    }
    else if (typeof define === "function" && define.amd) {
        define(["beetle"], function (beetle) {
            factory(root, beetle || root.beetle);
        });
    }
    else {
        return factory(root, root.beetle);
    }
})(this, function (root, beetle) {
    "use strict";

    if (!beetle) throw new Error("Beetle must be loaded first to register internalization.");
    
    var tr = {
        argCountMismatch: '"%0" için argüman sayısı uyuşmuyor.',
        arrayEmpty: 'Dizide hiçbir eleman bulunmuyor.',
        arrayNotSingle: 'Dizi sadece tek bir eleman içermiyor.',
        arrayNotSingleOrEmpty: 'Dizi boş ya da tek bir elemandan oluşmuyor.',
        assignError: '%0 alanı %1 ile güncellenemedi.',
        assignErrorNotEntity: '%0 alanı güncellenemedi, değer bir varlık değil.',
        autoGeneratedCannotBeModified: 'Otomatik oluşturulan alanlar güncellenemez.',
        beetleQueryChosenMultiTyped: 'Sorgu çok tipli olduğundan otomatik olarak Beetle sorgu cümlesi kullanıldı.',
        beetleQueryChosenPost: 'Sorgu POST yöntemi kullandığından otomatik olarak Beetle sorgu cümlesi kullanıldı.',
        beetleQueryNotSupported: 'Beetle sorguları desteklenmiyor, sadece OData sorgu parametrelerini kullanabilirsiniz (where, orderBy, select, expand, top, skip).',
        cannotBeEmptyString: '%0 boş değer olamaz.',
        cannotCheckInstanceOnNull: 'Null değer ile örnek kontrolü yapılamaz.',
        cannotDetachComplexTypeWithOwners: 'Sahibi olan karışık tipli varlıklar çıkarılamaz.',
        compareError: '%0 alanının değeri %1 ile eşit olmalıdır.',
        complexCannotBeNull: '%0 kompleks alanına boş değer atanamaz.',
        couldNotLoadMetadata: 'Metadata yüklenemedi.',
        couldNotLocateNavFixer: 'Observable provider bulunamadı.',
        couldNotLocatePromiseProvider: 'Promise provider bulunamadı.',
        couldNotParseToken: '%0 yorumlanamadı.',
        countDiffCantBeCalculatedForGrouped: 'İç-satır sayısı farkı "groupBy" ifadesi içeren sorgular için hesaplanamaz.',
        dataPropertyAlreadyExists: 'Bu alan zaten eklenmiş: %0.',
        entityAlreadyBeingTracked: 'Bu varlık zaten başka bir yönetici tarafından takip ediliyor.',
        entityNotBeingTracked: 'Varlık bir yönetici tarafından takip edilmiyor.',
        executionBothNotAllowedForNoTracking: 'Birleştirme stratejisi NoTracking veya NoTrackingRaw olduğunda (varlıklar takip edilmediğinde) çalışma stratejisi Both (önbellek+server) olamaz.',
        expressionCouldNotBeFound: 'Deyim bulunamadı.',
        functionNeedsAlias: '%0 foksiyonu düzgün çalışmak için takma ada ihtiyaç duyuyor. Takma adı linq gibi ayarlayabilirsiniz, p => p.Name.',
        functionNotSupportedForOData: 'OData %0 fonksiyonunu desteklemiyor, lütfen Beetle sorgu cümleciğini kullanın.',
        instanceError: '%0, %1 türünden bir örnek değil.',
        invalidArguments: 'Geçersiz argümanlar.',
        invalidDefaultValue: '%0, %0 için geçerli bir varsayılan değer değil..',
        invalidEnumValue: 'Geçersiz sıra değeri, %0 %1 içinde yer almıyor.',
        invalidExpression: '%0 sadece %1 tipinde ifadeler içerebilir.',
        invalidPropertyAlias: 'Geçersiz alan takma adı.',
        invalidStatement: 'Geçersiz ifade.',
        invalidValue: '%0 alanı için geçersiz değer.',
        managerInvalidArgs: 'Geçersiz argümanlar. Olabilecekler: {DataService, [Injections]} veya {Uri, [Metadata], [Injections]}.',
        maxLenError: '%0 alanı uzunluğu %1 değerinden fazla olamaz.',
        maxPrecisionError: '%0 değeri maksimum %1 hassasiyeti aşıyor.',
        mergeStateError: '%0 durumundaki varlıklar içeri alınamaz.',
        minLenError: '%0 alanı uzunluğu %1 değerinden fazla olmalıdır.',
        noMetadataEntityQuery: 'Varlık sorgulama için Metadata gereklidir.',
        noMetadataRegisterCtor: 'Yapıcı kaydetmek için Metadata gereklidir.',
        noOpenGroup: 'Açık bir grup bulunamadı.',
        notFoundInMetadata: '%0 Metadata içinde bulunamadı.',
        notImplemented: '%0 %1 uygulanmamış.',
        notNullable: '%0 alanına null atanamaz.',
        oDataNotSupportMultiTyped: 'Çok-tipli sorgular OData servisleri ile kullanılamazlar.',
        onlyManagerCreatedCanBeExecuted: 'Sadece yönetici ile oluşturulmuş sorgular direk çalıştırılabilir.',
        onlyManagerCreatedCanAcceptEntityShortName: 'Sadece yönetici ile oluşturulmuş sorgular varlık adı parametresini kabul edebilir.',
        pendingChanges: 'Bekleyen değişiklikler',
        pluralNeedsInverse: 'Çoklu ilişkileri yükleyebilmek için alanın tersi de tanımlı olmalıdır (Order->OrderDetails var iken OrderDetails->Order ilişkisinin de olması gibi).',
        projectionsMustHaveAlias: 'Tüm yansıtılmış alanların bir adı ya da takma adı olmalıdır.',
        propertyNotFound: '%0 alanı bulunamadı.',
        queryClosed: 'Sorgu kapalı, ifade eklenemedi. Sorgular, first, single, any, all vs.. gibi bazı ifadelerden sonra çalıştırılmak zorundadır.',
        rangeError: '%0 alanı değeri %1 ile %2 arasında olmalıdır.',
        requiredError: '%0 alanı gereklidir.',
        sameKeyExists: 'Aynı anahtar değerine sahip başka bir varlık bulunuyor.',
        sameKeyOnDifferentTypesError: 'İki farklı tipte ancak aynı ata sınıfa sahip varlık aynı anahtar değer ile önbellekte bulunamaz (%0, %1).',
        settingArrayNotAllowed: 'Dizi atamasına izin verilmiyor, isterseniz bu davranışı beetle.settings.setArraySetBehaviour(behaviour) ayarı ile değiştirebilirsiniz.',
        stringLengthError: '%0 alanı için uzunluk %1 ile %2 arasında olmalıdır.',
        syncNotSupported: '%0 senkron ajax çağrılarını desteklemiyor.',
        twoEndCascadeDeleteNotAllowed: 'İki uçlu kademeli silme yapılamaz.',
        typeError: '%0, %1 tipinde değil.',
        typeMismatch: '%0 tip uyuşmazlığı. beklenen tip: %1, verilen tip: %2, değer: %3',
        typeRequiredForLocalQueries: 'Lokal sorgu çalıştırabilmek için varlık tipi belirtilmiş olmalıdır (createQuery("Entities", "Entity") veya createEntityQuery("Entity")).',
        unclosedQuote: 'Kapatılmamış tırnak: "%0".',
        unclosedToken: 'Kapatılmamış "%0".',
        unexpectedProperty: 'Beklenmeyen alan "%0".',
        unexpectedToken: 'Beklenmeyen %0.',
        unknownDataType: 'Bilinmeyen veri tipi: %0.',
        unknownExpression: 'Bilinmeyen ifade.',
        unknownFunction: 'Bilinmeyen fonksiyon: %0.',
        unknownParameter: 'Bilinmeyen parametre: %0.',
        unknownValidator: 'Bilinmeyen doğrulayıcı tipi: %0.',
        unsoppertedState: 'Uyumsuz varlık durumu: %0.',
        validationErrors: 'Doğrulama hataları',
        validationFailed: 'Doğrulama başarısız.',
        valueCannotBeNull: 'Değer null olamaz: %0.',
        operatorNotSupportedForOData: 'Operatör OData sorgularında desteklenmiyor: %0.'
    };

    beetle.registerI18N("tr", tr, true);

    return beetle;
});