import Joi from "joi";

export const validateJSONfile = Joi.object({
  fileName: Joi.string().required().messages({ no: "Invalid type" }),
  fileType: Joi.string().valid("application/json").required(),
  fileSize: Joi.number().integer().min(1).max(1000000).required(),
  fileData: Joi.object().required(),
});

export const validateXMLfile = Joi.object({
  fileName: Joi.string().required().messages({ no: "Invalid type" }),
  fileType: Joi.string().valid("text/xml").required(),
  fileSize: Joi.number().integer().min(1).max(1000000).required(),
  fileData: Joi.object().required(),
});

//Handle file validation
export const handleFileValidate = (fileType, fileData) => {
  let error;

  //Check file type to be validated
  if (fileType == "XML") {
    error = validateXMLfile.validate(fileData);
  } else if (fileType == "JSON") {
    error = validateJSONfile.validate(fileData);
  }

  //If an error body is returned, throw an error.
  if (error.error) {
    throw new Error(error.error.message);
  }

  return;
};
