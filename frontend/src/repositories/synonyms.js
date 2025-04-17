import axios from 'axios';

class SynonymsRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchSynonyms({ company_name, usecase_name, configuration_name, stateSetters, data }) {
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { page, limit, search, direction, variant } = data;

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${
        this.baseURL
      }/rdis/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/synonyms?page_no=${
        page ?? 1
      }&page_size=${limit ?? 10}&search=${search ?? ''}${
        direction != undefined && direction != null ? `&direction=${direction}` : ''
      }${variant != undefined && variant != null ? `&variant=${variant}` : ''}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  }
  async uploadFile({ company_name, usecase_name, configuration_name, stateSetters, data }) {
    const { file, content, mode, overwrite } = data;
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);
    if (overwrite) formData.append('overwrite', overwrite);

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/synonyms/bulk-upload/${mode}`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data.data);
      setLoading(false);

      return response.data.data;
    } catch (error) {
      console.log('error', error);
      setError(error);
      setLoading(false);
      throw error.response.data.detail;
    }
  }
}

export default SynonymsRepository;
