import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  coverageReport: null,
};

//Initiates a POST request to create the coverage report
export const createCoverageReport = createAsyncThunk(
  "user/createCoverageReport",
  async (requestPayload, thunkAPI) => {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    };

    const response = await fetch("http://localhost:3000/api/upload", options);
    return response.json();
  }
);

export const coverageReportSlice = createSlice({
  name: "coverageReport",
  initialState,
  reducers: {
    setCoverageReport: (state, action) => {
      createCoverageReport(action.payload);
    },
    resetCoverageReport: (state, action) => {
      state.coverageReport = initialState.coverageReport;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createCoverageReport.fulfilled, (state, action) => {
      state.coverageReport = action.payload;
    });
  },
});

export default coverageReportSlice.reducer;
export const { setCoverageReport, resetCoverageReport } =
  coverageReportSlice.actions;
