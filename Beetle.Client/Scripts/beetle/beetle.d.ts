﻿// Type definitions for beetle.js 2.0
// Project: https://github.com/umutozel/Beetle.js
// File version: 2.0.7

declare module beetle {

    module interfaces {
        interface Delegate {
            ();
        }

        interface Delegate1<T> {
            (t: T);
        }

        interface Delegate2<T1, T2> {
            (t1: T1, t2: T2);
        }

        interface Delegate3<T1, T2, T3> {
            (t1: T1, t2: T2, t3: T3);
        }

        interface Delegate4<T1, T2, T3, T4> {
            (t1: T1, t2: T2, t3: T3, t4: T4);
        }

        interface Delegate5<T1, T2, T3, T4, T5> {
            (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5);
        }

        interface Func<TResult> {
            (): TResult;
        }

        interface Func1<T, TResult> {
            (t: T): TResult;
        }

        interface Func2<T1, T2, TResult> {
            (t1: T1, t2: T2): TResult;
        }

        interface FuncAccessor<T, TResult> {
            (t?: T): TResult;
        }

        interface Dictionary<T> {
            [key: string]: T;
        }

        interface Grouping<T, TKey> {
            Key: TKey;
            Items: Array<T>;
        }

        interface ParameterlessConstructor<T> {
            new (): T;
        }

        interface TrackableArray<T> extends Array<T> {
            object: Object;
            property: string;
            after: interfaces.Delegate5<Object, string, TrackableArray<T>, T[], T[]>;
            changing: Event;
            changed: Event;

            remove(...T): T[];
            load(expands: string[], resourceName: string, options: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<T[]>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.QueryResultArray<T>>;
        }

        interface PropertyValidator {
            name: string;
            message: string;
            args?: any;

            toString(): string;
            validate(value: any, entity: IEntity): string;
        }

        interface EntityValidator {
            name: string;
            message: string;
            args?: any;

            toString(): string;
            validate(entity: IEntity): string;
        }

        interface ValidationError {
            message: string;
            entity: IEntity;
            property?: string;
            value?: any;
        }

        interface EntityValidationError {
            entity: IEntity;
            validationErrors: ValidationError[];
        }

        interface ManagerValidationError extends Error {
            entities: IEntity[];
            entitiesInError: EntityValidationError[];
            manager: core.EntityManager;
        }

        interface DataTypeBase {
            name: string;
            isComplex: boolean;

            toString(): string;
            getRawValue(value: any): string;
            isValid(value: any): boolean;
            toODataValue(value: any): string;
            toBeetleValue(value: any): string;
            defaultValue(): any;
            autoValue(): any;
            handle(value: any): any;
        }

        interface MetadataPart {
            name: string;
            displayName?: string;

            toString(): string;
            validate(entity: IEntity): ValidationError[];
        }

        interface Property extends MetadataPart {
            owner: EntityType;
            isComplex: boolean;
            validators: PropertyValidator[];

            addValidation(name: string, func: Func2<any, IEntity, string>, message: string, args?: any);
        }

        interface DataProperty extends Property {
            dataType: DataTypeBase;
            isNullable: boolean;
            isKeyPart: boolean;
            generationPattern: enums.generationPattern;
            defaultValue: any;
            useForConcurrency: boolean;
            relatedNavigationProperties: NavigationProperty[];
            isEnum: boolean;

            isValid(value: any): boolean;
            handle(value: any): any;
            getDefaultValue(): any;
        }

        interface NavigationProperty extends Property {
            entityTypeName: string;
            entityType: EntityType;
            isScalar: boolean;
            associationName: string;
            cascadeDelete: boolean;
            foreignKeyNames: string[];
            foreignKeys: DataProperty[];
            triggerOwnerModify: boolean;

            inverse: NavigationProperty;
            checkAssign(entity: IEntity);
        }

        interface EntityType extends MetadataPart {
            shortName: string;
            keyNames: string[];
            baseTypeName: string;
            setName: string;
            setTypeName: string;
            metadataManager: metadata.MetadataManager;
            hasMetadata: boolean;
            properties: string[];
            isComplexType: boolean;
            dataProperties: DataProperty[];
            navigationProperties: NavigationProperty[];
            keys: DataProperty[];
            floorType: EntityType;
            baseType: EntityType;
            validators: EntityValidator[];
            constructor: Delegate1<RawEntity>;
            initializer: Delegate1<IEntity>;

            getProperty(propertyPath: string): Property;
            registerCtor(ctor?: Delegate1<RawEntity>, initializer?: Delegate1<IEntity>);
            createEntity(initialValues: Object): IEntity;
            createRawEntity(initialValues: Object): RawEntity;
            isAssignableWith(otherType: EntityType): boolean;
            isAssignableTo(otherType: EntityType): boolean;
            addValidation(name: string, func: Func1<IEntity, string>, message: string, args?: any);
        }

        interface InternalSet<T extends IEntity> {
            toString(): string;
            getEntity(key: string): T;
            getEntities(): T[];
        }

        interface Query<T> {
            inlineCount(isEnabled?: boolean): Query<T>;
            ofType<TResult extends T>(type: string | ParameterlessConstructor<TResult>): Query<TResult>;
            where(predicate: string, varContext?: any): Query<T>;
            orderBy(keySelector?: string): Query<T>;
            orderByDesc(keySelector?: string): Query<T>;
            select<TResult>(selector: string | string[] | Func1<T, TResult>): Query<TResult>;
            select(selector: string | string[] | Func1<T, any>): Query<any>;
            select<TResult>(...selectors: string[]): Query<TResult>;
            select(...selectors: string[]): Query<any>;
            skip(count: number): Query<T>;
            take(count: number): Query<T>;
            top(count: number): Query<T>;
            groupBy<TResult>(keySelector: string | Func1<T, any>, valueSelector: string | Func1<Grouping<T, any>, TResult>): Query<TResult>;
            groupBy(keySelector: string | Func1<T, any>, valueSelector?: string | Func1<Grouping<T, any>, any>): Query<any>;
            groupBy<TKey, TResult>(keySelector: Func1<T, TKey>, valueSelector: Func1<Grouping<T, TKey>, TResult>): Query<TResult>;
            distinct(): Query<T>;
            distinct<TResult>(selector: string | Func1<T, TResult>): Query<TResult>;
            distinct(selector: string | Func1<T, any>): Query<any>;
            reverse(): Query<T>;
            selectMany<TResult>(selector: string | Func1<T, Array<TResult>>): Query<TResult>;
            selectMany(selector: string | Func1<T, any>): Query<any>;
            skipWhile(predicate: string, varContext?: any): Query<T>;
            takeWhile(predicate: string, varContext?: any): Query<T>;
        }

        interface ClosedQueryable<T, TOptions> {
            execute(options?: TOptions, successCallback?: Delegate1<T>, errorCallback?: Delegate1<Error>): PromiseLike<T>;
            execute<TResult>(options?: TOptions, successCallback?: Delegate1<TResult>, errorCallback?: Delegate1<Error>): PromiseLike<TResult>;
        }

        interface EntityQueryParameter {
            name: string;
            value: any;
        }

        interface QueryResultExtra {
            userData: string;
            headerGetter: Func1<string, string>;
            xhr: Object;
        }

        interface QueryResultArray<T> extends Array<T> {
            $extra: QueryResultExtra;
            $inlineCount?: number;
        }

        interface PropertyValue {
            p: string; // property
            v: any; // value
        }

        interface OwnerValue {
            owner: IEntity;
            property: Property;
        }

        interface Tracker {
            entity: IEntity;
            entityType: EntityType;
            entityState: enums.entityStates;
            forceUpdate: boolean;
            originalValues: PropertyValue[];
            changedValues: PropertyValue[];
            manager: core.EntityManager;
            owners: OwnerValue[];
            validationErrors: ValidationError[];
            validationErrorsChanged: core.Event;
            entityStateChanged: core.Event;
            propertyChanged: core.Event;
            arrayChanged: core.Event;
            key: string;

            toString(): string;
            isChanged(): boolean;
            toAdded();
            toModified();
            toDeleted();
            toUnchanged();
            toDetached();
            undoChanges();
            acceptChanges();
            getValue(property: string);
            setValue(property: string, value: any);
            getOriginalValue(property: string): any;
            foreignKey(navProperty: NavigationProperty): string;
            createLoadQuery<T extends IEntity>(navPropName: string, resourceName: string): querying.EntityQuery<T>;
            loadNavigationProperty(navPropName: string, expands: string[], resourceName: string, options?: ManagerQueryOptions,
                successCallback?: Delegate1<any>, errorCallback?: Delegate1<Error>): PromiseLike<any>;
            validate(): ValidationError[];
            toRaw(includeNavigations?: boolean): Object;
        }

        interface TrackInfo {
            t: string; // type
            s: string; // state
            i: number; // save index
            f?: boolean; // force update
            o?: Object[]; // original values
        }

        interface ExportEntity {
            $t: TrackInfo;
        }

        interface SavePackage {
            entities: ExportEntity[];
            forceUpdate?: boolean;
            userData: string;
        }

        interface GeneratedValue {
            Index: number;
            Property: string;
            Value: any;
        }

        interface SaveResult {
            AffectedCount: number;
            GeneratedValues: GeneratedValue[];
            GeneratedEntities: IEntity[];
            UserData: string;
        }

        interface RawEntity {
            $type: string;
            $extra?: QueryResultExtra;
        }
    }

    interface IEntity {
        $tracker: interfaces.Tracker;
        $extra?: interfaces.QueryResultExtra;
    }

    interface ServiceQueryOptions {
        handleUnmappedProperties?: boolean;
        usePost?: boolean;
        dataType?: string;
        contentType?: string;
        async?: boolean;
        timeout?: boolean;
        extra?: Object;
        uri?: string;
        headers?: Object;
        includeXhr?: boolean;
        includeHeaderGetter?: boolean;
    }

    interface ManagerQueryOptions extends ServiceQueryOptions {
        merge?: enums.mergeStrategy;
        execution?: enums.executionStrategy;
        autoFixScalar?: boolean;
        autoFixPlural?: boolean;
        varContext?: Object;
        useBeetleQueryStrings?: boolean;
    }

    interface ServiceOptions {
        ajaxTimeout?: number;
        dataType?: string;
        contentType?: string;
        registerMetadataTypes?: boolean;
        ajaxProvider: baseTypes.AjaxProviderBase;
        serializationService: baseTypes.SerializationServiceBase;
    }

    interface ManagerOptions extends ServiceOptions {
        autoFixScalar?: boolean;
        autoFixPlural?: boolean;
        validateOnMerge?: boolean;
        validateOnSave?: boolean;
        liveValidate?: boolean;
        handleUnmappedProperties?: boolean;
        forceUpdate?: boolean;
        workAsync?: boolean;
        minimizePackage?: boolean;
        promiseProvider: baseTypes.PromiseProviderBase;
    }

    interface ExportOptions {
        minimizePackage?: boolean;
    }

    interface ServiceSaveOptions {
        async?: boolean;
        timeout?: number;
        extra?: Object;
        uri?: string;
        saveAction?: string;
        headers?: Object;
        includeXhr?: boolean;
        includeHeaderGetter?: boolean;
    }

    interface ManagerSaveOptions extends ExportOptions, ServiceSaveOptions {
        entities?: IEntity[];
        forceUpdate?: boolean;
        validateOnSave?: boolean;
        autoFixScalar?: boolean;
        autoFixPlural?: boolean;
    }

    interface ObservableProviderCallbackOptions {
        propertyChange: interfaces.Delegate4<Object, string, interfaces.FuncAccessor<any, any>, any>;
        arrayChange: interfaces.Delegate5<Object, string, Array<any>, Array<any>, Array<any>>;
        dataPropertyChange: interfaces.Delegate4<Object, string, interfaces.FuncAccessor<any, any>, any>;
        scalarNavigationPropertyChange: interfaces.Delegate4<Object, string, interfaces.FuncAccessor<any, any>, any>;
        pluralNavigationPropertyChange: interfaces.Delegate5<Object, string, Array<any>, Array<any>, Array<any>>;
        arraySet: interfaces.Delegate4<Object, Array<any>, Array<any>, string>;
    }

    module helper {
        function combine(obj1: Object, obj2: Object): Object;
        function extend(obj1: Object, obj2: Object): Object;
        function objEquals(obj1: Object, obj2: Object): boolean;
        function formatString(str: string, ...params: string[]): string;
        function createGuid(): string;
        function getResourceValue(resourceName: string, altValue?: string): string;
        function createError(message: string, args?: Array<any>, props?: interfaces.Dictionary<any>): Error;
        function getFuncName(func: Function): string;
        function createTrackableArray<T>(initial: Array<T>, object: Object, property: string,
            after: interfaces.Delegate5<Object, string, TrackableArray<T>, Array<T>, Array<T>>): interfaces.TrackableArray<T>;
    }

    class Assert {
        constructor(value: any, name: string);

        errors: string[];

        hasValue(): Assert;
        isObject(): Assert;
        isFunction(): Assert;
        isNotEmptyString(): Assert;
        isTypeOf(typeName: string): Assert;
        isArray(): Assert;
        isEnum(enumType: string): Assert;
        isInstanceOf(type: any): Assert;
        check();

        static hasValue(value: any): boolean;
        static isObject(value: any): boolean;
        static isFunction(value: any): boolean;
        static isNotEmptyString(value: any): boolean;
        static isTypeOf(value: any, typeName: string): boolean;
        static isArray(value: any): boolean;
        static isEnum(value: any, enumType: string): boolean;
        static isInstanceOf(value: any, type: any): boolean;
    }

    module baseTypes {
        abstract class DateConverterBase {
            constructor(name: string);

            name: string;

            toString(): string;
            parse(value: string): Date;
            toISOString(value: Date): string;
        }
        abstract class ObservableProviderBase {
            constructor(name: string);

            name: string;

            toString(): string;
            isObservable(object: Object, property: string): boolean;
            toObservable(object: string, type: interfaces.EntityType, callbacks: ObservableProviderCallbackOptions);
            getValue(object: Object, property: string): any;
            setValue(object: Object, property: string, value: any);
        }
        abstract class AjaxProviderBase {
            constructor(name: string);

            name: string;

            toString(): string;
            doAjax(uri: string, type: string, dataType: string, contentType: string, data: any, async: boolean, timeout: number,
                extra: interfaces.Dictionary<any>, headers: interfaces.Dictionary<string>,
                successCallback: interfaces.Delegate3<any, interfaces.Func1<string, string>, Object>,
                errorCallback: interfaces.Delegate1<Error>);
        }
        abstract class SerializationServiceBase {
            constructor(name: string);

            name: string;

            toString(): string;
            serialize(data: any): string;
            deserialize(string: string): any;
        }
        abstract class PromiseProviderBase {
            constructor(name: string);

            name: string;

            toString(): string;
            deferred(): any;
            getPromise(deferred: any): PromiseLike<any>;
            resolve(deferred: any, data: any);
            reject(deferred: any, error: Error);
        }
        abstract class DataServiceBase {
            constructor(url: string, loadMetadata?: boolean, options?: ServiceOptions);
            constructor(url: string, metadataManager: metadata.MetadataManager, options?: ServiceOptions);
            constructor(url: string, metadata: Object, options?: ServiceOptions);
            constructor(url: string, metadata: string, options?: ServiceOptions);

            uri: string;
            ajaxTimeout: number;
            dataType: string;
            contentType: string;
            metadataManager: metadata.MetadataManager;

            toString(): string;
            isReady(): boolean;
            ready(callback: interfaces.Delegate);
            getEntityType(shortName: string): interfaces.EntityType;
            getEntityType<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>): interfaces.EntityType;
            createQuery<T extends IEntity>(resourceName: string, type?: string | interfaces.ParameterlessConstructor<T>, manager?: core.EntityManager): querying.EntityQuery<T>;
            createQuery(resourceName: string, shortName?: string, manager?: core.EntityManager): querying.EntityQuery<any>;
            createEntityQuery<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, resourceName?: string, manager?: core.EntityManager): querying.EntityQuery<T>;
            registerCtor<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, ctor?: interfaces.Delegate1<interfaces.RawEntity>, initializer?: interfaces.Delegate1<T>);

            fetchMetadata(options?: ServiceQueryOptions, successCallback?: interfaces.Delegate1<Object>, errorCallback?: interfaces.Delegate1<Error>);
            createEntityAsync<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues: Object, options: ServiceQueryOptions,
                successCallback: interfaces.Delegate1<T>, errorCallback: interfaces.Delegate1<Error>);
            createEntityAsync(shortName: string, initialValues: Object, options: ServiceQueryOptions,
                successCallback: interfaces.Delegate1<IEntity>, errorCallback: interfaces.Delegate1<Error>);
            executeQuery<T>(query: querying.EntityQuery<T>, options: ServiceQueryOptions, successCallback: interfaces.Delegate1<interfaces.QueryResultArray<T>>, errorCallback: interfaces.Delegate1<Error>);
            executeQuery<T>(query: interfaces.ClosedQueryable<T, ServiceQueryOptions>, options: ServiceQueryOptions, successCallback: interfaces.Delegate1<T>, errorCallback: interfaces.Delegate1<Error>);
            executeQuery(query: querying.EntityQuery<any>, options: ServiceQueryOptions, successCallback: interfaces.Delegate1<any>, errorCallback: interfaces.Delegate1<Error>);
            executeQuery(query: interfaces.ClosedQueryable<any, ServiceQueryOptions>, options: ServiceQueryOptions, successCallback: interfaces.Delegate1<any>, errorCallback: interfaces.Delegate1<Error>);
            saveChanges(options: ServiceSaveOptions, successCallback: interfaces.Delegate1<interfaces.SaveResult>, errorCallback: interfaces.Delegate1<Error>);
        }
    }

    module impls {
        var defaultDateConverterInstance: baseTypes.DateConverterBase;
        var koObservableProviderInstance: baseTypes.ObservableProviderBase;
        var propertyObservableProviderInstance: baseTypes.ObservableProviderBase;
        var jQueryAjaxProviderInstance: baseTypes.AjaxProviderBase;
        var angularAjaxProviderInstance: baseTypes.AjaxProviderBase;
        var jsonSerializationServiceInstance: baseTypes.SerializationServiceBase;
        var qPromiseProviderInstance: baseTypes.PromiseProviderBase;
        var angularPromiseProviderInstance: baseTypes.PromiseProviderBase;
        var jQueryPromiseProviderInstance: baseTypes.PromiseProviderBase;
    }

    module metadata {
        class MetadataManager {
            constructor();
            constructor(metadataObj: Object);
            constructor(metadataStr: string);

            types: interfaces.EntityType[];
            typesDict: interfaces.Dictionary<interfaces.EntityType>;
            enums: Object[];
            name: string;
            displayName: string;

            toString(): string;
            getEntityTypeByFullName(typeName: string, throwIfNotFound?: boolean): interfaces.EntityType;
            getEntityType(shortName: string, throwIfNotFound?: boolean): interfaces.EntityType;
            getEntityType<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>, throwIfNotFound?: boolean): interfaces.EntityType;
            registerCtor<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, ctor?: interfaces.Delegate1<interfaces.RawEntity>, initializer?: interfaces.Delegate1<T>);
            createEntity(shortName: string, initialValues?: Object): IEntity;
            createEntity<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>, initialValues?: Object): T;
            createRawEntity(shortName: string, initialValues?: Object): interfaces.RawEntity;
            createRawEntity<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>, initialValues?: Object): interfaces.RawEntity;
            parseBeetleMetadata(metadata: string | Object);
        }
    }

    module querying {
        class ArrayQuery<T> implements interfaces.Query<T> {
            constructor(array: T[]);

            array: Array<T>;
            options: Object;
            inlineCountEnabled: boolean;

            // not removing redundant qualifiers so they would be same (ok to copy-paste) with array extensions
            inlineCount(isEnabled?: boolean): beetle.querying.ArrayQuery<T>;
            ofType<TResult extends T>(type: string | beetle.interfaces.ParameterlessConstructor<TResult>): beetle.querying.ArrayQuery<TResult>;
            where(predicate: string, varContext?: any): beetle.querying.ArrayQuery<T>;
            where(predicate: beetle.interfaces.Func1<T, boolean>): beetle.querying.ArrayQuery<T>;
            orderBy(keySelector: string | beetle.interfaces.Func2<T, T, number>): beetle.querying.ArrayQuery<T>;
            orderByDesc(keySelector: string | beetle.interfaces.Func2<T, T, number>): beetle.querying.ArrayQuery<T>;
            select<TResult>(selector: string | string[] | beetle.interfaces.Func1<T, TResult>): beetle.querying.ArrayQuery<TResult>;
            select<TResult>(...selectors: string[]): beetle.querying.ArrayQuery<TResult>;
            select(selector: string | string[] | beetle.interfaces.Func1<T, any>): beetle.querying.ArrayQuery<any>;
            select(...selectors: string[]): beetle.querying.ArrayQuery<any>;
            skip(count: number): beetle.querying.ArrayQuery<T>;
            take(count: number): beetle.querying.ArrayQuery<T>;
            top(count: number): beetle.querying.ArrayQuery<T>;
            groupBy<TKey, TResult>(keySelector: beetle.interfaces.Func1<T, TKey>, valueSelector: beetle.interfaces.Func1<beetle.interfaces.Grouping<T, TKey>, TResult>): beetle.querying.ArrayQuery<TResult>;
            groupBy<TResult>(keySelector: string | beetle.interfaces.Func1<T, any>, valueSelector: string | beetle.interfaces.Func1<beetle.interfaces.Grouping<T, any>, TResult>): beetle.querying.ArrayQuery<TResult>;
            groupBy(keySelector: string | beetle.interfaces.Func1<T, any>, valueSelector: string | beetle.interfaces.Func1<beetle.interfaces.Grouping<T, any>, any>): beetle.querying.ArrayQuery<any>;
            distinct(): beetle.querying.ArrayQuery<T>;
            distinct<TResult>(selector: string | beetle.interfaces.Func1<T, TResult>): beetle.querying.ArrayQuery<TResult>;
            distinct(selector: string | beetle.interfaces.Func1<T, any>): beetle.querying.ArrayQuery<any>;
            reverse(): beetle.querying.ArrayQuery<T>;
            selectMany<TResult>(selector: string | beetle.interfaces.Func1<T, Array<TResult>>): beetle.querying.ArrayQuery<TResult>;
            selectMany(selector: string | beetle.interfaces.Func1<T, any>): beetle.querying.ArrayQuery<any>;
            skipWhile(predicate: string, varContext?: any): beetle.querying.ArrayQuery<T>;
            skipWhile(predicate: beetle.interfaces.Func1<T, boolean>): beetle.querying.ArrayQuery<T>;
            takeWhile(predicate: string, varContext?: any): beetle.querying.ArrayQuery<T>;
            takeWhile(predicate: beetle.interfaces.Func1<T, boolean>): beetle.querying.ArrayQuery<T>;
            all(predicate?: string, varContext?: any): boolean;
            all(predicate: beetle.interfaces.Func1<T, boolean>): boolean;
            any(predicate?: string, varContext?: any): boolean;
            any(predicate: beetle.interfaces.Func1<T, boolean>): boolean;
            avg(selector?: string | beetle.interfaces.Func1<T, number>): number;
            max(selector?: string | beetle.interfaces.Func1<T, number>): number;
            min(selector?: string | beetle.interfaces.Func1<T, number>): number;
            sum(selector?: string | beetle.interfaces.Func1<T, number>): number;
            count(predicate?: string, varContext?: any): number;
            count(predicate: beetle.interfaces.Func1<T, boolean>): number;
            first(predicate?: string, varContext?: any): T;
            first(predicate: beetle.interfaces.Func1<T, boolean>): T;
            firstOrDefault(predicate?: string, varContext?: any): T;
            firstOrDefault(predicate: beetle.interfaces.Func1<T, boolean>): T;
            single(predicate?: string, varContext?: any): T;
            single(predicate: beetle.interfaces.Func1<T, boolean>): T;
            singleOrDefault(predicate?: string, varContext?: any): T;
            singleOrDefault(predicate: beetle.interfaces.Func1<T, boolean>): T;
            last(predicate?: string, varContext?: any): T;
            last(predicate: beetle.interfaces.Func1<T, boolean>): T;
            lastOrDefault(predicate?: string, varContext?: any): T;
            lastOrDefault(predicate: beetle.interfaces.Func1<T, boolean>): T;

            execute(options?: Object): T[];
            execute<TResult>(options?: Object): TResult;
            x(options?: Object): T[];
            x<TResult>(options?: Object): TResult;
        }
        class EntityQuery<T> implements interfaces.Query<T> {
            constructor(resource: string, type: interfaces.EntityType, manager: core.EntityManager);

            resource: string;
            entityType: interfaces.EntityType;
            manager: core.EntityManager;
            parameters: interfaces.EntityQueryParameter[];
            options: ManagerQueryOptions;
            hasBeetlePrm: boolean;
            inlineCountEnabled: boolean;

            inlineCount(isEnabled?: boolean): EntityQuery<T>;
            ofType<TResult extends T>(type: string | interfaces.ParameterlessConstructor<TResult>): EntityQuery<TResult>;
            where(predicate: string | interfaces.Func1<T, boolean>, varContext?: any): EntityQuery<T>;
            orderBy(keySelector: string | interfaces.Func1<T, any>): EntityQuery<T>;
            orderByDesc(keySelector: string | interfaces.Func1<T, any>): EntityQuery<T>;
            select<TResult>(selector: string | string[] | interfaces.Func1<T, TResult>): EntityQuery<TResult>;
            select(selector: string | string[] | interfaces.Func1<T, any>): EntityQuery<any>;
            select<TResult>(...selectors: string[]): EntityQuery<TResult>;
            select(...selectors: string[]): EntityQuery<any>;
            skip(count: number): EntityQuery<T>;
            take(count: number): EntityQuery<T>;
            top(count: number): EntityQuery<T>;
            groupBy<TKey, TResult>(keySelector: interfaces.Func1<T, TKey>, valueSelector: interfaces.Func1<interfaces.Grouping<T, TKey>, TResult>): EntityQuery<TResult>;
            groupBy<TResult>(keySelector: string | interfaces.Func1<T, any>, valueSelector: string | interfaces.Func1<interfaces.Grouping<T, any>, TResult>): EntityQuery<TResult>;
            groupBy(keySelector: string | interfaces.Func1<T, any>, valueSelector?: string | interfaces.Func1<interfaces.Grouping<T, any>, any>): EntityQuery<any>;
            distinct(): EntityQuery<T>;
            distinct<TResult>(selector: string | interfaces.Func1<T, TResult>): EntityQuery<TResult>;
            distinct(selector: string | interfaces.Func1<T, any>): EntityQuery<any>;
            reverse(): EntityQuery<T>;
            selectMany<TResult>(selector: string | interfaces.Func1<T, Array<TResult>>): EntityQuery<TResult>;
            selectMany(selector: string | interfaces.Func1<T, any>): EntityQuery<any>;
            skipWhile(predicate: string | interfaces.Func1<T, boolean>, varContext?: any): EntityQuery<T>;
            takeWhile(predicate: string | interfaces.Func1<T, boolean>, varContext?: any): EntityQuery<T>;
            all(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<boolean, ManagerQueryOptions>;
            any(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<boolean, ManagerQueryOptions>;
            avg(selector?: string | interfaces.Func1<T, number>): interfaces.ClosedQueryable<number, ManagerQueryOptions>;
            max(selector?: string | interfaces.Func1<T, number>): interfaces.ClosedQueryable<number, ManagerQueryOptions>;
            min(selector?: string | interfaces.Func1<T, number>): interfaces.ClosedQueryable<number, ManagerQueryOptions>;
            sum(selector?: string | interfaces.Func1<T, number>): interfaces.ClosedQueryable<number, ManagerQueryOptions>;
            count(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<number, ManagerQueryOptions>;
            first(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;
            firstOrDefault(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;
            single(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;
            singleOrDefault(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;
            last(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;
            lastOrDefault(predicate?: string | interfaces.Func1<T, boolean>, varContext?: any): interfaces.ClosedQueryable<T, ManagerQueryOptions>;

            execute(options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<interfaces.QueryResultArray<T>>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.QueryResultArray<T>>;
            execute<TResult>(options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<TResult>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<TResult[]>;
            x(options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<interfaces.QueryResultArray<T>>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.QueryResultArray<T>>;
            x<TResult>(options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<TResult>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<TResult[]>;

            expand(propertyPath: string): EntityQuery<T>;
            include(propertyPath: string): EntityQuery<T>;
            setParameter(name: string, value: any): EntityQuery<T>;
            withOptions(options: ManagerQueryOptions): EntityQuery<T>;
        }
    }

    module core {
        class ValueNotifyWrapper {
            constructor(value: any);

            value: any;
        }
        class Event {
            constructor(name: string, publisher: Object);

            name: string;

            toString(): string;
            subscribe(subscriber: interfaces.Delegate2<any, any>);
            unsubscribe(subscriber: interfaces.Delegate2<any, any>);
            notify(data: any);
        }
        module dataTypes {
            var object: interfaces.DataTypeBase;
            var array: interfaces.DataTypeBase;
            var func: interfaces.DataTypeBase;
            var string: interfaces.DataTypeBase;
            var guid: interfaces.DataTypeBase;
            var date: interfaces.DataTypeBase;
            var dateTimeOffset: interfaces.DataTypeBase;
            var time: interfaces.DataTypeBase;
            var boolean: interfaces.DataTypeBase;
            var int: interfaces.DataTypeBase;
            var number: interfaces.DataTypeBase;
            var byte: interfaces.DataTypeBase;
            var binary: interfaces.DataTypeBase;
            var enumeration: interfaces.DataTypeBase; // enum
            var geometry: interfaces.DataTypeBase;
            var geography: interfaces.DataTypeBase;
        }
        class EntityContainer {
            constructor();

            toString(): string;
            push(entity: IEntity);
            remove(entity: IEntity);
            getEntities(): IEntity[];
            getEntityByKey(key: string, type: interfaces.EntityType): IEntity;
            getRelations(entity: IEntity, navProperty: interfaces.NavigationProperty): IEntity[];
            relocateKey(entity: IEntity, oldKey: string, newKey: string);
            getChanges(): IEntity[];
            count(): number;
            findEntitySet(type: interfaces.EntityType): EntitySet<IEntity>;
            getEntitySet(type: interfaces.EntityType): EntitySet<IEntity>;
        }
        class EntitySet<T extends IEntity> extends querying.EntityQuery<T> {
            constructor(type: interfaces.EntityType, manager: EntityManager);

            local: interfaces.InternalSet<T>;

            toString(): string;
            create(initialValues?: Object): T;
            createDetached(): T;
            createRaw(): interfaces.RawEntity;
            add(T);
            attach(T);
            remove(T);
        }
        class EntityManager {
            constructor(url: string, loadMetadata?: boolean, options?: ManagerOptions);
            constructor(url: string, metadataManager: metadata.MetadataManager, options?: ManagerOptions);
            constructor(url: string, metadata: string, options?: ManagerOptions);
            constructor(url: string, metadata: Object, options?: ManagerOptions);
            constructor(service: baseTypes.DataServiceBase, options?: ManagerOptions);

            dataService: baseTypes.DataServiceBase;
            entities: EntityContainer;
            pendingChangeCount: number;
            validationErrors: interfaces.ValidationError[];
            entityStateChanged: Event;
            validationErrorsChanged: Event;
            hasChangesChanged: Event;
            queryExecuting: Event;
            queryExecuted: Event;
            saving: Event;
            saved: Event;

            autoFixScalar: boolean;
            autoFixPlural: boolean;
            validateOnMerge: boolean;
            validateOnSave: boolean;
            liveValidate: boolean;
            handleUnmappedProperties: boolean;
            forceUpdate: boolean;
            workAsync: boolean;
            minimizePackage: boolean;

            toString(): string;
            isReady(): boolean;
            ready(callback: interfaces.Delegate): PromiseLike<any>;
            getEntityType(shortName: string): interfaces.EntityType;
            getEntityType<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>): interfaces.EntityType;
            createQuery<T>(resourceName: string, shortName?: string): querying.EntityQuery<T>;
            createQuery<T extends IEntity>(resourceName: string, type?: string | interfaces.ParameterlessConstructor<T>): querying.EntityQuery<T>;
            createQuery(resourceName: string, shortName?: string): querying.EntityQuery<any>;
            createEntityQuery<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, resourceName?: string): querying.EntityQuery<T>;
            createEntityQuery(shortName: string, resourceName?: string): querying.EntityQuery<any>;
            registerCtor<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, ctor?: interfaces.Delegate1<interfaces.RawEntity>, initializer?: interfaces.Delegate1<T>);
            createEntity<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object): T;
            createEntity(shortName: string, initialValues?: Object): IEntity;
            createDetachedEntity<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object): T;
            createDetachedEntity(shortName: string, initialValues?: Object): IEntity;
            createRawEntity(shortName: string, initialValues?: Object): interfaces.RawEntity;
            createRawEntity<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object): interfaces.RawEntity;
            createEntityAsync<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<T>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<T>;
            createEntityAsync(typeName: string, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<IEntity>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<IEntity>;
            createDetachedEntityAsync<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<T>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<T>;
            createDetachedEntityAsync(typeName: string, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<IEntity>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<IEntity>;
            createRawEntityAsync<T extends IEntity>(type: string | interfaces.ParameterlessConstructor<T>, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<interfaces.RawEntity>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.RawEntity>;
            createRawEntityAsync(typeName: string, initialValues?: Object, options?: ManagerQueryOptions,
                successCallback?: interfaces.Delegate1<interfaces.RawEntity>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.RawEntity>;
            executeQuery<T>(query: querying.EntityQuery<T>, options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<T[]>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<T[]>;
            executeQuery<T>(query: interfaces.ClosedQueryable<T, ManagerQueryOptions>, options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<T>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<T>;
            executeQuery(query: querying.EntityQuery<any>, options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<any>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<any>;
            executeQuery(query: interfaces.ClosedQueryable<any, ManagerQueryOptions>, options?: ManagerQueryOptions, successCallback?: interfaces.Delegate1<any>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<any>;
            executeQueryLocally<T>(query: querying.EntityQuery<T>, varContext?: any): T[];
            executeQueryLocally<T>(query: interfaces.ClosedQueryable<T, any>, varContext?: any): T;
            getEntityByKey<T extends IEntity>(key: any, type: string | interfaces.EntityType | interfaces.ParameterlessConstructor<T>): T;
            deleteEntity(entity: IEntity);
            addEntity(entity: IEntity);
            attachEntity(entity: IEntity);
            detachEntity(entity: IEntity);
            createSavePackage(entities?: IEntity[], options?: ExportOptions): interfaces.SavePackage;
            rejectChanges(entity: IEntity, includeRelations?: boolean);
            undoChanges(entity: IEntity, includeRelations?: boolean);
            acceptChanges(entity: IEntity, includeRelations?: boolean);
            exportEntities(entities?: IEntity[], options?: ExportOptions): interfaces.ExportEntity[];
            importEntities(exportedEntities: interfaces.ExportEntity[], merge?: enums.mergeStrategy);
            hasChanges(): boolean;
            getChanges(): IEntity[];
            saveChanges(options?: ManagerSaveOptions, successCallback?: interfaces.Delegate1<interfaces.SaveResult>, errorCallback?: interfaces.Delegate1<Error>): PromiseLike<interfaces.SaveResult>;
            toEntity<T extends IEntity>(object: interfaces.RawEntity): T;
            toEntity(object: interfaces.RawEntity): IEntity;
            fixNavigations(entity: IEntity);
            isInManager(entity: IEntity): boolean;
            flatEntities(entities: IEntity[]): IEntity[];
            entry(entity: IEntity): interfaces.Tracker;
            createSet<T extends IEntity>(type: string | interfaces.EntityType | interfaces.ParameterlessConstructor<T>): EntitySet<T>;
            createSet(type: interfaces.EntityType): EntitySet<IEntity>;
            set<T extends IEntity>(constructor: interfaces.ParameterlessConstructor<T>): EntitySet<T>;
            set(shortName: string): EntitySet<IEntity>;
        }
        class EntityBase implements IEntity {
            constructor(type: interfaces.EntityType, manager?: EntityManager, initialValues?: Object);

            $tracker: interfaces.Tracker;
            $extra: interfaces.QueryResultExtra;
        }
    }

    module services {
        class MvcService extends baseTypes.DataServiceBase {
            constructor(url: string, loadMetadata?: boolean, options?: ServiceOptions);
            constructor(url: string, metadata: metadata.MetadataManager | Object | string, options?: ServiceOptions);

            executeQueryParams(resource: string, queryParams: Object, options: ServiceQueryOptions,
                successCallback: interfaces.Delegate1<interfaces.SaveResult>, errorCallback: interfaces.Delegate1<Error>);
            fixResults(objects: interfaces.RawEntity[], makeObservable?: boolean, handleUnmappedProperties?: boolean): interfaces.RawEntity[];
        }
        class WebApiService extends MvcService {
        }
    }

    module enums {
        enum observableProviders {
            Knockout, Property
        }
        enum promiseProviders {
            Q, jQuery, Angular
        }
        enum ajaxProviders {
            jQuery, Angular
        }
        enum serializationServices {
            JSON
        }
        enum entityStates {
            Detached, Unchanged, Added, Deleted, Modified
        }
        enum mergeStrategy {
            Preserve, Overwrite, ThrowError, NoTracking, NoTrackingRaw
        }
        enum executionStrategy {
            Server, Local, Both, LocalIfEmptyServer
        }
        enum generationPattern {
            Identity, Computed
        }
        enum arraySetBehaviour {
            NotAllowed, Replace, Append
        }
        enum serviceTypes {
            WebApi, Mvc
        }
    }

    module events {
        var queryExecuting: core.Event;
        var queryExecuted: core.Event;
        var saving: core.Event;
        var saved: core.Event;
        var info: core.Event;
        var warning: core.Event;
        var error: core.Event;
    }

    module settings {
        var autoFixScalar: boolean;
        var autoFixPlural: boolean;
        var validateOnMerge: boolean;
        var validateOnSave: boolean;
        var liveValidate: boolean;
        var handleUnmappedProperties: boolean;
        var isCaseSensitive: boolean;
        var ignoreWhiteSpaces: boolean;
        var forceUpdate: boolean;
        var cacheMetadata: boolean;
        var registerMetadataTypes: boolean;
        var workAsync: boolean;
        var ajaxTimeout: number;
        var minimizePackage: boolean;

        function getObservableProvider(): baseTypes.ObservableProviderBase;
        function setObservableProvider(type: enums.observableProviders | string | baseTypes.ObservableProviderBase);
        function getAjaxProvider(): baseTypes.AjaxProviderBase;
        function setAjaxProvider(type: enums.ajaxProviders | string | baseTypes.AjaxProviderBase);
        function getSerializationService(): baseTypes.SerializationServiceBase;
        function setSerializationService(type: enums.serializationServices | string | baseTypes.SerializationServiceBase);
        function getArraySetBehaviour(): enums.arraySetBehaviour;
        function setArraySetBehaviour(type: enums.arraySetBehaviour | string);
        function getDefaultServiceType(): enums.serviceTypes;
        function setDefaultServiceType(type: enums.serviceTypes | string);
        function getDateConverter(): baseTypes.DateConverterBase;
        function setDateConverter(converter: baseTypes.DateConverterBase);
        function getLocalizeFunction(): interfaces.Func1<string, string>;
        function setLocalizeFunction(func: interfaces.Func1<string, string>);
    }

    class MetadataManager extends metadata.MetadataManager { }
    class EntityManager extends core.EntityManager { }
    class EntityBase extends core.EntityBase { }
    class EntitySet<T extends IEntity> extends core.EntitySet<T> { }
    class WebApiService extends services.WebApiService { }
    class MvcService extends services.MvcService { }
    class Event extends core.Event { }
    class ValueNotifyWrapper extends core.ValueNotifyWrapper { }
    interface TrackableArray<T> extends interfaces.TrackableArray<T> { }

    var version: string;
}

interface Array<T> {
    asQueryable(): beetle.querying.ArrayQuery<T>;
    q(): beetle.querying.ArrayQuery<T>;
}

interface StringConstructor {
    substringOf(other: string): boolean;
    startsWith(other: string): boolean;
    endsWith(other: string): boolean;
}

interface NumberConstructor {
    round(): number;
    ceiling(): number;
    floor(): number;
}