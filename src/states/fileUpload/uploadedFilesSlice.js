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
    resetFiles: (state, action) => {
      state.burpSuiteXMLFile = initialState.burpSuiteXMLFile;
      state.swaggerJSONFile = initialState.swaggerJSONFile;
    },
  },
});

export default uploadedFilesSlice.reducer;
export const { uploadSwaggerJSONFile, uploadBurSuiteXMLFile, resetFiles } =
  uploadedFilesSlice.actions;
