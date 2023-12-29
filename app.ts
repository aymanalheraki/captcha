import * as fs from "fs";
import * as tiff from "tiff";

async function cropAndSaveMultiPageTiff(
  inputTiffPath: string,
  outputFolderPath: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  try {
    // Read the input multi-page TIFF image
    const tiffData = await fs.promises.readFile(inputTiffPath);
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
        data: page.data.subarray(
          y * page.width * 4 + x * 4,
          (y + height) * page.width * 4 + (x + width) * 4
        ),
      });

      // Save the cropped image to the output folder
      const outputFilePath = `${outputFolderPath}/output_page_${
        pageIndex + 1
      }.tif`;
      await fs.promises.writeFile(
        outputFilePath,
        Buffer.from(croppedImageData)
      );

      console.log(
        `Page ${
          pageIndex + 1
        }: Image cropped and saved successfully - ${outputFilePath}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
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
