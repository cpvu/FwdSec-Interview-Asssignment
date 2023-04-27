// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import fs from "fs";
import xml2js from "xml2js";
import lodash from "lodash";

export const config = {
  api: {
    bodyParser: false,
  },
};

//Parse the formData object sent from the client containing both the burp suite history file and swagger file
async function parseFormData(request) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, maxFileSize: 50 * 1024 * 1024 });

    form.parse(request, async (err, fields, files) => {
      if (err) {
        console.log(err);
        reject({ success: false });
      } else {
        const burpSuiteFile = files.burpSuiteHistoryFile;
        const swaggerFile = files.swaggerFile;

        resolve([burpSuiteFile, swaggerFile]);
      }
    });
  });
}

//Convert the JSON persistent file into a JSON
async function fileJsonDataToJson(jsonFile) {
  const jsonContent = await fs.promises.readFile(jsonFile.filepath);
  const jsonData = JSON.parse(jsonContent);

  return jsonData;
}

//Convert the XML persistent file into a JSON
async function fileXMLDataToJson(xmlFile) {
  const parser = new xml2js.Parser();

  const fileReadStream = fs.readFileSync(xmlFile.filepath);

  let xmlJSON = new Promise((resolve, reject) => {
    parser.parseString(fileReadStream, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      // Convert the JavaScript object to a JSON string
      resolve(JSON.parse(JSON.stringify(result)));
    });
  });

  return xmlJSON;
}

async function calculateCoverage(swaggerJSON, burpSuiteHistoryJSON) {
  let hashmap = {};
  let number = 0;
  let responseJson = {};

  let swaggerEndpoints = Object.keys(swaggerJSON.paths);

  swaggerEndpoints.forEach((route) => {
    let endPointMethods = Object.keys(swaggerJSON.paths[`${route}`]);
    number += endPointMethods.length;

    if (!hashmap[route]) {
      hashmap[route] = endPointMethods;
    }
  });

  //console.log(hashmap);

  burpSuiteHistoryJSON.items.item.forEach((item) => {
    let burpMethod = item.method.toString().toLowerCase();
    let burpPath = item.path.toString().substring(3);

    console.log(burpPath.split("?")[0]);

    for (let endpoint of swaggerEndpoints) {
      const pattern = endpoint.replace(/\{\w+\}/g, "\\w+");
      if (
        new RegExp(`^${pattern}$`).test(burpPath.split("?")[0]) &&
        hashmap[endpoint].includes(burpMethod)
      ) {
        console.log(
          `Endpoint '${endpoint}' matched key '${burpPath}' with methods ${hashmap[endpoint]}`
        );

        hashmap[endpoint].pop(burpMethod);
        break;
      }
    }
  });

  //console.log(hashmap);
  //console.log(number);
  //console.log(responseJson);
}

//Route request handler
export default async function handler(req, res) {
  // If user authentication is added, can add a check for ensure route is protected
  if (req.method != "POST") {
    return res.status(400).json({ success: "false" });
  }
  try {
    const [burpSuiteHistoryFile, swaggerFile] = await parseFormData(req);
    const swaggerJSON = await fileJsonDataToJson(swaggerFile);
    const burpSuiteHistoryJSON = await fileXMLDataToJson(burpSuiteHistoryFile);

    calculateCoverage(swaggerJSON, burpSuiteHistoryJSON);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
}
