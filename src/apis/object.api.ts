import axios from "axios";
import { CONFIG_API, DEFAULT_SATELLITE_FILE } from "../constants/api.constant";
import { generateGuid } from "../utils/text.utils";

export const fetchImageDate = async () => {
  // Simulate fetching existing objects from backend API
  let url = "";
  if (CONFIG_API.enable) {
    if (CONFIG_API.enableGetImage === false) {
      url = CONFIG_API.demoUrl;
    } else {
      const response = await axios.get(`${CONFIG_API.host}/api/image`);
      url = response.data;
    }
  } else url = DEFAULT_SATELLITE_FILE;

  return fetch(url).then((response) => response.arrayBuffer());
};

export const fetchObjects = async () => {
  // Simulate fetching existing objects from backend API
  if (CONFIG_API.enable) await axios.get(`${CONFIG_API.host}/api/objects`);
  return [];
};

export const createObject = async (payload: GeoJSON.Feature) => {
  console.log(`Call API create object`, payload);
  const result = { ...payload };
  if (CONFIG_API.enable) {
    const response = await axios.post(
      `${CONFIG_API.host}/api/objects`,
      payload
    );
    result.id = response.data.id;
  }

  if (!result.id) result.id = generateGuid();

  return result;
};

export const updateObject = async (id: string, payload: GeoJSON.Feature) => {
  console.log(`Call API update object`, id, payload);
  if (CONFIG_API.enable)
    await axios.put(`${CONFIG_API.host}/api/objects/${id}`, payload);
  return payload;
};

export const deleteObject = async (id: string) => {
  console.log(`Call API delete object`, id);
  if (CONFIG_API.enable)
    await axios.delete(`${CONFIG_API.host}/api/objects/${id}`);
  return true;
};
