import axios from "axios";
// const baseUrl = "http://localhost:3001/channels";
const baseUrl = "/api/channels";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const exportedObject =  { getAll };

export default exportedObject;