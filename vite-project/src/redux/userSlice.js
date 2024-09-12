import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    age: null,
    email: '',
    firstName: '',
    lastName: '',
    homeAddress: '',
    logo: '',
    _id: '',
  },
  theme: {
    primaryColor: '#000000',
    secondaryColor: '#000000',
  },
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (!action.payload) {
        state.user = initialState.user; // Reset user to initial state
        state.token = null;
        state.theme = initialState.theme;
      } else {
        const { user, token, primaryColor, secondaryColor } = action.payload;
        state.user = {
          age: user.age,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          homeAddress: user.homeAddress,
          logo: user.logo,
          _id: user._id,
        };
        state.theme = {
          primaryColor: primaryColor || '#000000',
          secondaryColor: secondaryColor || '#000000',
        };
        state.token = token;
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    clearUser: (state) => {
      state.user = initialState.user;
      state.theme = initialState.theme;
      state.token = null;
    },
  },
});

export const { setUser, updateUser, updateTheme, clearUser } = userSlice.actions;
export default userSlice.reducer;
