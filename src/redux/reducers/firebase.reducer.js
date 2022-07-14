import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUniqueListBy } from "utils/getUniqueList";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  allMsgs: [],
  filteredList: [],
};

export const fetchMsgs = createAsyncThunk("firebase/getMsgs", async () => {
  try {
    var chats = [];
    const chatRef = collection(db, "Chats");
    let q = query(chatRef, orderBy("createdAt", "asc"));
    await getDocs(q)
      .then((res) => {
        chats = res.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
      })
      .catch((e) => console.log("err", e));
    return chats;
  } catch (ex) {}
});

export const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchMsgs.fulfilled]: (state, action) => {
      if (action.payload) {
        state.allMsgs = action.payload;
        let result = getUniqueListBy(action.payload, "senderId");
        const index = result.findIndex(
          (a) => a.data?.senderId === "Diet Coach"
        );
        if (index === -1) console.log("null");
        else result.splice(index, 1);
        state.filteredList = result;
      }
    },
  },
});

export default firebaseSlice.reducer;
