// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // If user authentication is added, can add a check for ensure route is protected
  if (req.method != "POST") {
    return res.status(400).json({ success: "false" });
  }

  const form = formidable({ multiples: true, maxFileSize: 50 * 1024 * 1024 });

  try {
    form.parse(req, async (err, field, files) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ success: false });
      }
      console.log("Parsing Files...");

      const burpSuiteHistoryFile = files.burpSuiteHistoryFile;
      const swaggerFile = files.swaggerFile;

      const jsonContent = await fs.promises.readFile(swaggerFile.filepath);
      const jsonData = JSON.parse(jsonContent);

      console.log(jsonData.paths);

      return res.status(200).json({ success: true });
    });
  } catch (err) {
    console.log(err);
  }
}
