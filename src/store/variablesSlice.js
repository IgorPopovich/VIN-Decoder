import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getVehicleVariableList } from '../api/vinApi';

export const fetchVehicleVariables = createAsyncThunk(
  'variables/fetchVehicleVariables',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getVehicleVariableList();
      return {
        message: data?.Message ?? null,
        results: data?.Results ?? [],
      };
    } catch (err) {
      return rejectWithValue(err?.message || 'Помилка завантаження');
    }
  },
  {
    condition: (_, { getState }) => {
      const { variables } = getState();
      return variables.status !== 'loading' && variables.status !== 'succeeded';
    },
  }
);

const initialState = {
  list: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  message: null,
  ui: {
    page: 1,
  },
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    clearVariables: (state) => {
      state.list = [];
      state.status = 'idle';
      state.error = null;
      state.message = null;
      state.ui.page = 1;
    },
    setVariablesPage: (state, action) => {
      const next = Math.trunc(Number(action.payload));
      state.ui.page = Number.isFinite(next) && next > 0 ? next : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleVariables.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehicleVariables.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
        state.list = action.payload.results;
      })
      .addCase(fetchVehicleVariables.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Помилка завантаження';
      });
  },
});

export default variablesSlice.reducer;

export const { clearVariables, setVariablesPage } = variablesSlice.actions;

export const selectVariablesState = (state) => state.variables;
export const selectVariablesList = (state) => state.variables.list;
export const selectVariablesStatus = (state) => state.variables.status;
export const selectVariablesMessage = (state) => state.variables.message;
export const selectVariablesError = (state) => state.variables.error;
export const selectVariablesPage = (state) => state.variables.ui.page;
export const selectVariableById = (state, id) =>
  state.variables.list.find((v) => v.ID === id) ?? null;
