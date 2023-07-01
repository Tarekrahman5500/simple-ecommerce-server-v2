export class ErrorModel {


    /**
     * Unique error code which identifies the error.
     */
        // eslint-disable-line no-use-before-define
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    public code: string;
    /**
     * Status code of the error.
     */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    public status: number;  // eslint-disable-line no-use-before-define
    /**
     * Any additional data that is required for translation.
     */
    public metaData?: any;
}