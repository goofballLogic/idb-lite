export type TestReturnType = (index: any) => Promise<void>;
export type TestType = (message: string, body: () => Promise<void>) => TestReturnType;
export interface UtilitiesType {
    deleteDatabase: (dbName: string) => Promise<void>,
    assertEqual: (expected: any, actual: any) => void,
    assertDeepEqual: (expected: any, actual: any) => void
}
