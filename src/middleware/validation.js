import Joi from "joi";

export const validateJSONfile = Joi.object({
  originalFilename: Joi.string().required().messages({ no: "Invalid type" }),
  mimetype: Joi.string().valid("application/json").required(),
  size: Joi.number().integer().min(1).max(100000).required(),
}).unknown();

export const validateXMLfile = Joi.object({
  originalFilename: Joi.string().required().messages({ no: "Invalid type" }),
  mimetype: Joi.string().valid("text/XML").required(),
  size: Joi.number().integer().min(1).max(100000).required(),
}).unknown();

export const handleFileValidate = (fileType, fileData) => {
  let error;
  try {
    if (fileType == "XML") {
      error = validateXMLFile.validate(fileData);
    } else if (fileType == "JSON") {
      error = validateJSONfile.validate(fileData);
    }

    if (error) {
      throw new Error(error.to);
    }
    return;
  } catch (err) {}
};
