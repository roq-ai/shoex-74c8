import axios from 'axios';
import queryString from 'query-string';
import { QualityControlInterface, QualityControlGetQueryInterface } from 'interfaces/quality-control';
import { GetQueryInterface } from '../../interfaces';

export const getQualityControls = async (query?: QualityControlGetQueryInterface) => {
  const response = await axios.get(`/api/quality-controls${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createQualityControl = async (qualityControl: QualityControlInterface) => {
  const response = await axios.post('/api/quality-controls', qualityControl);
  return response.data;
};

export const updateQualityControlById = async (id: string, qualityControl: QualityControlInterface) => {
  const response = await axios.put(`/api/quality-controls/${id}`, qualityControl);
  return response.data;
};

export const getQualityControlById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/quality-controls/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteQualityControlById = async (id: string) => {
  const response = await axios.delete(`/api/quality-controls/${id}`);
  return response.data;
};
