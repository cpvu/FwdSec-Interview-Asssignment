import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  swaggerJSONFile: {},
  burpSuiteXMLFile: {},
};

export const uploadedFilesSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    uploadSwaggerJSONFile: (state, action) => {
      state.swaggerJSONFile = action.payload;
    },
    uploadBurSuiteXMLFile: (state, action) => {
      state.burpSuiteXMLFile = action.payload;
    },
  },
});

export default uploadedFilesSlice.reducer;
export const { uploadSwaggerJSONFile, uploadBurSuiteXMLFile } =
  uploadedFilesSlice.actions;
