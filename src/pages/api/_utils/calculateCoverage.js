function initializeHashmap(swaggerJSON) {
  let swaggerEndPointHashmap = {};
  let swaggerEndpointKeys = Object.keys(swaggerJSON.paths);
  let totalEndpoints = 0;

  //Initialize a swaggerEndPointHashmap with the swagger endpoints
  swaggerEndpointKeys.forEach((route) => {
    let endPointMethods = Object.keys(swaggerJSON.paths[`${route}`]);
    totalEndpoints += endPointMethods.length;

    if (!swaggerEndPointHashmap[route]) {
      swaggerEndPointHashmap[route] = endPointMethods;
    }
  });

  swaggerEndPointHashmap.totalEndpoints = totalEndpoints;
  return swaggerEndPointHashmap;
}

//Calculate coverage of untested and tested endpoints
export async function calculateCoverage(swaggerJSON, burpSuiteHistoryJSON) {
  let swaggerEndPointHashmap = initializeHashmap(swaggerJSON);
  let totalEndpoints = swaggerEndPointHashmap.totalEndpoints;

  let totalTestedEndpoints = 0;
  let responseJson = {};
  let swaggerEndpointKeys = Object.keys(swaggerEndPointHashmap);

  //Iterating over the tested endpoints and matching to the swaggerEndPointHashmap of endpoints to match tested routes and methods
  burpSuiteHistoryJSON.items.item.forEach((item) => {
    let burpMethod = item.method.toString().toLowerCase();
    let burpPath = item.path.toString().substring(3);

    for (let endpoint of swaggerEndpointKeys) {
      const pattern = endpoint.replace(/\{\w+\}/g, "\\w+");

      let matchEndpoints = new RegExp(`^${pattern}$`).test(
        burpPath.split("?")[0]
      );

      //Match tested burp endpoint to untested endpoints using regex pattern and ensuring method is unique in endpoint swaggerEndPointHashmap
      if (
        matchEndpoints &&
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

  delete swaggerEndPointHashmap["totalEndpoints"];

  // Storing untested and tested endpoints into a response JSON to send back to client
  responseJson = {
    untestedEndpoints: swaggerEndPointHashmap,
    testedEndpoints: responseJson,
    totalEndpoints: totalEndpoints,
    coverage: (totalTestedEndpoints / totalEndpoints) * 100,
  };

  return responseJson;
}
