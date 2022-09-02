export const EditData = (data, id, dataItem) => {
  const newData = data.map((item) =>
    item._id === id ? dataItem : item
  );
  return newData;
};

export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};

export const editDataChat = (chats, id, data) => {
  // console.log("CHATS", chats, "ID", id, "DATA", data);
  const newItem = chats.find((item) => item._id === id);
  newItem.latestMessage = data;

  const newData = chats.map((item) =>
    item._id === id ? newItem : item
  );

  // console.log(newData);

  // SORT DATA BY TIME | PUSH THE CHAT ON THE TOP AFTER NEW MESSAGE
  newData.sort((a, b) =>
    a?.latestMessage?.createdAt < b?.latestMessage?.createdAt
      ? 1
      : b?.latestMessage?.createdAt < a?.latestMessage?.createdAt
      ? -1
      : 0
  );

  return newData;
};
