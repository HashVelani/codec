import zlib = require ("zlib");
import {CodecResponseCodes, CodecStrings} from "../constants/CodecConstants";
import {ICodec} from "../interfaces/ICodec";
import {ErrorUtilities} from "../utilities";
import {It} from "../it/It";

/**
 * Class that zips and unzips JSON data
 *
 * @export
 * @class Codec
 * @implements {ICodec}
 */
export class Codec implements ICodec
{
    /**
     *Creates an instance of Codec.
     * @memberof Codec
     */
    constructor()
    {
    }

    /**
     *
     * @description Compresses Raw Data Structures
     * @template T
     * @param {T} data The data to zip
     * @returns {Promise<Buffer>}
     * @memberof Codec
     */
    public zip<T>(data: T): Promise<Buffer>
    {
        return new Promise((resolve, reject) =>
        {
            if (It.isNullOrUndefined(data))
            {
                return reject(ErrorUtilities.constructInternalError(CodecResponseCodes.DataUndefined, CodecStrings.className));
            }

            if (typeof data === "string")
            {
                return reject(ErrorUtilities.constructInternalError(CodecResponseCodes.InvalidString, CodecStrings.className));
            }

            const payload: string = JSON.stringify(data);
            const myDataBuffer: Buffer = new Buffer(payload);

            zlib.gzip(myDataBuffer, (error: Error, result: Buffer) =>
            {
                if (It.isNotNullOrUndefined(error))
                {
                    return reject(error);
                }

                return resolve(result);
            });
        });
    }

    /**
     *
     * @description Decompress Raw Compressed Data Structure
     * @template T
     * @param {Buffer} data The data to unzip
     * @returns {Promise<T>}
     * @memberof Codec
     */
    public unzip<T>(data: Buffer): Promise<T>
    {
        return new Promise((resolve, reject) =>
        {
            if (It.isNullOrUndefined(data))
            {
                return reject(ErrorUtilities.constructInternalError(CodecResponseCodes.DataUndefined, CodecStrings.className));
            }

            zlib.gunzip(data, (error: Error, result: Buffer) =>
            {
                if (It.isNotNullOrUndefined(result))
                {
                    const myDataBufferToString: string = result.toString();
                    const myDataStringToObject: any = JSON.parse(myDataBufferToString);

                    return resolve(myDataStringToObject);
                }

                return reject(error);
            });
        });
    }
}