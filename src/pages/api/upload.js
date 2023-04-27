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
  let swaggerEndPointHashmap = {};
  let totalEndpoints = 0;
  let totalTestedEndpoints = 0;
  let responseJson = {};

  let swaggerEndpointKeys = Object.keys(swaggerJSON.paths);

  //Initialize a swaggerEndPointHashmap with the swagger endpoints
  swaggerEndpointKeys.forEach((route) => {
    let endPointMethods = Object.keys(swaggerJSON.paths[`${route}`]);
    totalEndpoints += endPointMethods.length;

    if (!swaggerEndPointHashmap[route]) {
      swaggerEndPointHashmap[route] = endPointMethods;
    }
  });

  console.log(responseJson);

  //Iterating over the tested endpoints and matching to the swaggerEndPointHashmap of endpoints to match tested routes and methods
  burpSuiteHistoryJSON.items.item.forEach((item) => {
    let burpMethod = item.method.toString().toLowerCase();
    let burpPath = item.path.toString().substring(3);

    for (let endpoint of swaggerEndpointKeys) {
      const pattern = endpoint.replace(/\{\w+\}/g, "\\w+");

      //Match tested burp endpoint to untested endpoints using regex pattern and ensuring method is unique in endpoint swaggerEndPointHashmap
      if (
        new RegExp(`^${pattern}$`).test(burpPath.split("?")[0]) &&
        swaggerEndPointHashmap[endpoint].includes(burpMethod)
      ) {
        console.log(
          `Endpoint '${endpoint}' matched key '${burpPath}' using method ${burpMethod} with methods ${swaggerEndPointHashmap[endpoint]}`
        );

        totalTestedEndpoints += 1;

        //Remove matched method from route in swaggerEndPointHashmap and add to response JSON tested endpoints
        let methodIndex = swaggerEndPointHashmap[endpoint].indexOf(burpMethod);
        let splicedMethod = swaggerEndPointHashmap[endpoint]
          .splice(methodIndex, 1)
          .toString();

        if (!responseJson[endpoint]) {
          responseJson[endpoint] = [];
        }
        responseJson[endpoint].push(splicedMethod);
        break;
      }
    }
  });

  // Storing untested and tested endpoints into a response JSON to send back to client
  responseJson = {
    untestedEndpoints: swaggerEndPointHashmap,
    testedEndpoints: responseJson,
    totalEndpoints: totalEndpoints,
    coverage: (totalTestedEndpoints / totalEndpoints) * 100,
  };

  return responseJson;
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

    const responseJson = await calculateCoverage(
      swaggerJSON,
      burpSuiteHistoryJSON
    );

    res.status(200).json(responseJson);
  } catch (err) {
    console.log(err);
  }
}
