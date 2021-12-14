import axios from "axios";
const baseUrl = "/api/courses";
// const baseUrl = "http://localhost:3001/courses";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const createCourse = async (course) => {
  const response = await axios.post(baseUrl, course)
  return response.data
}

const exportedObject =  { getAll, createCourse };

export default exportedObject;