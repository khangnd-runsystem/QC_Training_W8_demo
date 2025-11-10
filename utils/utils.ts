import * as fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';

export class Utility {

    /**
     * Create a folder
     * @param folderPath
     */
    makeDir(folderPath: string): void {
        fs.mkdir(folderPath, { recursive: true }, (err: any) => {
            if (err) {
                console.log(err);
            }
        });
    }

    /**
     * Delete file
     * @param filePath
     */
    deleteFile(filePath: string): void {
        console.log(`delete file ${path.join(__dirname, filePath)}`);
        try {
            rimrafSync(path.join(__dirname, filePath));
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * delay timeout
     * @param second
     * @returns
     */
    delay(second: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    /**
     *
     * @param text get Subtring
     * @param start
     * @param end
     * @returns
     */
    getSubstring(text: string, start: number = 0, end: number = 0): string {
        if (end > text.length) end = text.length;
        try {
            return text.substring(start, end);
        } catch (error) {
            return '';
        }
    }

    /**
     *
     * @param text get Char at position
     * @param index
     * @returns
     */
    getCharAt(text: string, index: number = 0): string {
        if (text.length == 0 && text.length > index) return '';
        try {
            return text.charAt(index);
        } catch (error) {
            return '';
        }
    }

    /**
     * Extract the domain from a URL
     * @param url
     * @returns
     */
    getDomainFromUrl(url: string): any {
        try {
            const parsedUrl = new URL(url);
            return { protocol: parsedUrl.protocol, hostname: parsedUrl.hostname }; // Returns the domain (e.g., "www.example.com")
        } catch (error: any) {
            console.error('Invalid URL:', error);
            return {};
        }
    }

}