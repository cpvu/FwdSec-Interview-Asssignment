// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from "next-connect";
import { handleFileValidate, validateJSONfile } from "@/middleware/validation";

const handler = nc({
  onError: (err, req, res, next) => {
    console.log(err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

//Calculate coverage of untested and tested endpoints
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
//validateQuery(formDataSchema)
//Route request handler
handler.post(async (req, res) => {
  const burpSuiteHistoryJSON = req.body.burpJSON;
  const swaggerJSON = req.body.swaggerJSON;

  handleFileValidate("JSON", swaggerJSON);
  handleFileValidate("XML", burpSuiteHistoryJSON);

  const responseJson = await calculateCoverage(
    swaggerJSON.fileData,
    burpSuiteHistoryJSON.fileData
  );

  res.status(200).json(responseJson);
});

export default handler;
