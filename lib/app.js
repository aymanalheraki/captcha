"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const tiff = __importStar(require("tiff"));
function cropAndSaveMultiPageTiff(inputTiffPath, outputFolderPath, x, y, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the input multi-page TIFF image
            const tiffData = yield fs.promises.readFile(inputTiffPath);
            const pages = tiff.decode(tiffData);
            // Create the output folder if it doesn't exist
            if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath);
            }
            // Process each page in the multi-page TIFF
            for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                const page = pages[pageIndex];
                // Extract the specified region from the page
                const croppedImageData = tiff.decode({
                    width,
                    height,
                    data: page.data.subarray(y * page.width * 4 + x * 4, (y + height) * page.width * 4 + (x + width) * 4),
                });
                // Save the cropped image to the output folder
                const outputFilePath = `${outputFolderPath}/output_page_${pageIndex + 1}.tif`;
                yield fs.promises.writeFile(outputFilePath, Buffer.from(croppedImageData));
                console.log(`Page ${pageIndex + 1}: Image cropped and saved successfully - ${outputFilePath}`);
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
}
// Example usage
const inputTiffPath = "input_multi_page.tiff";
const outputFolderPath = "output_cropped_images";
const x = 100; // Replace with your desired x-coordinate
const y = 150; // Replace with your desired y-coordinate
const width = 200; // Replace with your desired width
const height = 250; // Replace with your desired height
// Call the function to crop and save the specified region from each page
cropAndSaveMultiPageTiff(inputTiffPath, outputFolderPath, x, y, width, height);
