/**
 * Created by [BombSquad Inc](http://www.bmbsqd.com)
 * User: Andy Hawkins
 * Date: 6/29/15
 * Time: 11:19 AM
 *   V 2.3.2 Mar 2018 Contribution: Ken Kohler.
 */

declare type localStorageDB_callback<T> = (object: T) => localStorageDB_dynamicFields;
declare type localStorageDB_callbackFilter<T> = (object: T) => boolean;

declare class localStorageDB<T = unknown> {
    constructor(database_name: string, storage_engine?: Storage); // Constructor: storage_engine can either be localStorage (default) or sessionStorage
    isNew(): boolean; // Returns true if a database was created at the time of initialisation with the constructor
    drop(): void; // Deletes a database, and purges it from localStorage
    getItem(key: string): string; // Retrieve specified value from localStorage
    replace(json: string): void; // Replaced entire contents of localStorage database with passed in json
    setItem(key: string, value: string): void; // Set value for localStorage
    tableCount(): number; // Returns the number of tables in a database
    commit(): boolean; // Commits the database to localStorage. Returns true if successful, and false otherwise (highly unlikely)
    serialize(): string; // Returns the entire database as serialized JSON
    tableExists<TKey extends keyof T>(table: TKey | [TKey]): boolean; // Checks whether a table exists in the database
    tableFields<TKey extends keyof T>(table: TKey | [TKey]): string[]; // Returns the list of fields of a table
    createTable<TKey extends keyof T>(table: TKey | [TKey], fields: string[]); // Creates a table - fields is an array of string fieldnames. 'ID' is a reserved fieldname.
    createTableWithData<TKey extends keyof T>(table: TKey | [TKey], rows: { [T: string]: any }[]);
	/*
	 Creates a table and populates it
	 rows is an array of object literals where each object represents a record
	 [{field1: val, field2: val}, {field1: val, field2: val}]
	 */
    alterTable<TKey extends keyof T>(table: TKey | [TKey], new_fields: string[] | string, default_values: localStorageDB_dynamicFields | string);
	/*
	 Alter a table
	 - new_fields can be a array of columns OR a string of single column.
	 - default_values (optional) can be a object of column's default values OR a default value string for single column for existing rows.
	 */
    dropTable<TKey extends keyof T>(table: TKey | [TKey]): void; // Deletes a table from the database
    truncate<TKey extends keyof T>(table: TKey | [TKey]): void; // Empties all records in a table and resets the internal auto increment ID to 0
    columnExists<TKey extends keyof T>(table: TKey | [TKey], field: string): boolean; // Checks whether a column exists in database table.
    rowCount<TKey extends keyof T>(table: TKey | [TKey]): number; // Returns the number of rows in a table
    insert<TKey extends keyof T>(table: TKey | [TKey], data: { [T: string]: any }): number;
	/*
	 Inserts a row into a table and returns its numerical ID
	 - data is an object literal with field-values
	 every row is assigned an auto-incremented numerical ID automatically
	 */
    query<TKey extends keyof T>(table: TKey | [TKey], query?: { [T: string]: any }, limit?: number, start?: number, sort?: any): Exclude<T[TKey], undefined>;
	/* DEPRECATED
	 Returns an array of rows (object literals) from a table matching the query.
	 - query is either an object literal or null. If query is not supplied, all rows are returned
	 - limit is the maximum number of rows to be returned
	 - start is the number of rows to be skipped from the beginning (offset)
	 - sort is an array of sort conditions, each one of which is an array in itself with two values
	 - distinct is an array of fields whose values have to be unique in the returned rows
	 Every returned row will have it's internal auto-incremented id assigned to the variable ID
	 */
    queryAll<TKey extends keyof T>(table: TKey | [TKey], params?: localStorageDB_queryParams<T[TKey]>): Exclude<T[TKey], undefined>;
	/*
	 Returns an array of rows (object literals) from a table matching the query.
	 - query is either an object literal or null. If query is not supplied, all rows are returned
	 - limit is the maximum number of rows to be returned
	 - start is the number of rows to be skipped from the beginning (offset)
	 - sort is an array of sort conditions, each one of which is an array in itself with two values
	 - distinct is an array of fields whose values have to be unique in the returned rows
	 Every returned row will have it's internal auto-incremented id assigned to the variable ID
	 */
    update<TKey extends keyof T, TKey2 extends keyof T[TKey]>(table: TKey | [TKey], query: localStorageDB_dynamicFields<T[TKey]> | localStorageDB_callbackFilter<T[TKey][0]>, update?: localStorageDB_callback<T[TKey][0]>): number;

	/*
	 Updates existing records in a table matching query, and returns the number of rows affected
	 - query is an object literal or a function. If query is not supplied, all rows are updated
	 - update_function is a function that returns an object literal with the updated values
	 */
    insertOrUpdate<TKey extends keyof T>(table: TKey | [TKey], query: localStorageDB_dynamicFields<T[TKey]> | localStorageDB_callbackFilter<T[TKey][0]>, data: localStorageDB_fields<T[TKey][0]>): number;
	/*
	 Inserts a row into a table if the given query matches no results, or updates the rows matching the query.
	 - query is either an object literal, function, or null.
	 - data is an object literal with field-values
	 Returns the numerical ID if a new row was inserted, or an array of IDs if rows were updated
	 */
    deleteRows<TKey extends keyof T>(table: TKey | [TKey], query: localStorageDB_dynamicFields<T[TKey]> | localStorageDB_callbackFilter<T[TKey][0]>): number;
	/*
	 Deletes rows from a table matching query, and returns the number of rows deleted
	 - query is either an object literal or a function. If query is not supplied, all rows are deleted
	 */
}

interface localStorageDB_fields<T> extends localStorageDB_dynamicFields<T> {
    ID: number;
}

interface localStorageDB_dynamicFields<T> {
    [T: string]: typeof T[keyof typeof T];
}

interface localStorageDB_queryParams<T> {
    query?: { [T: string]: typeof T[keyof typeof T] | localStorageDB_callback }; // - query is either an object literal or null. If query is not supplied, all rows are returned
    limit?: number; // - limit is the maximum number of rows to be returned
    start?: number; // - start is the number of rows to be skipped from the beginning (offset)
    sort?: { [T: string]: typeof T[keyof typeof T] }[]; // - sort is an array of sort conditions, each one of which is an array in itself with two values
    distinct?: string[]; // - distinct is an array of fields whose values have to be unique in the returned rows
}

declare module 'localstoragedb' {
    export = localStorageDB;
}
