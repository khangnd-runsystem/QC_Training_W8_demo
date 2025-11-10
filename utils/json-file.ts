import fs from 'fs';
import path from 'path';

export class JSONHandling {

    /**
     * read JSON file
     * @param filePath
     * @returns
     */
    readJSONFile(filePath:string): any | null {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

        /**
     * read JSON file
     * @param filePath
     * @returns
     */
    readJsonFileData<T>(filePath:string):T[] {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
            return JSON.parse(rawData) as T[];
        } catch (error) {
            console.error(error);
        }
        return [];
    }

}