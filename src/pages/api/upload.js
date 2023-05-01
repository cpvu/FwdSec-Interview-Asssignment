// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nc from "next-connect";
import { handleFileValidate, validateJSONfile } from "@/middleware/validation";
import { calculateCoverage } from "./_utils/calculateCoverage";
import { JSON, XML } from "@/constants/constants";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end("Something went wrong");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

//Route request handler
handler.post(async (req, res) => {
  const burpSuiteHistoryJSON = req.body.burpJSON;
  const swaggerJSON = req.body.swaggerJSON;

  //Server side file validation using JOI
  handleFileValidate(JSON, swaggerJSON);
  handleFileValidate(XML, burpSuiteHistoryJSON);

  const responseJson = await calculateCoverage(
    swaggerJSON.fileData,
    burpSuiteHistoryJSON.fileData
  );

  res.status(200).json(responseJson);
});

export default handler;
