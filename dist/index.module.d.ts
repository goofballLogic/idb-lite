// jaffacake protocol
export declare class Store {
    readonly storeName: string;
    constructor(dbName?: string, storeName?: string);
}
export declare function get<Type>(key: IDBValidKey, store?: Store): Promise<Type>;
export declare function set(key: IDBValidKey, value: any, store?: Store): Promise<void>;
export declare function del(key: IDBValidKey, store?: Store): Promise<void>;
export declare function clear(store?: Store): Promise<void>;
export declare function keys(store?: Store): Promise<IDBValidKey[]>;

// helper protocol
export declare function closeAll(): Promise<void>;