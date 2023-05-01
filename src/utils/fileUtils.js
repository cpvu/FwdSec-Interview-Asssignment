import xml2js from "xml2js";

//Convert the file contents to string for request body
function convertFileToString(uploadFile) {
  if (!uploadFile) return;
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(uploadFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  } catch (error) {
    if (error.TypeError) {
      console.log("Upload an appropriate file!");
    }
  }
}

//Convert XML file string to JSON
async function convertXMLFileToJson(xmlFile) {
  const parser = new xml2js.Parser();
  const fileString = await convertFileToString(xmlFile);

  try {
    let xmlJSON = new Promise((resolve, reject) => {
      parser.parseString(fileString, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        // Convert the JavaScript object to a JSON string
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    return xmlJSON;
  } catch (error) {
    console.log(error);
  }
}

//Create new object containing information regarding the file for validation
function getFileInformation(dataFile) {
  try {
    let fileData = {
      fileName: dataFile.name,
      fileSize: dataFile.size,
      fileType: dataFile.type,
    };
    return fileData;
  } catch (error) {
    console.log(error);
  }
}

export { convertFileToString, convertXMLFileToJson, getFileInformation };
