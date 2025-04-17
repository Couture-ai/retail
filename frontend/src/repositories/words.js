import axios from 'axios';

class WordsRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchWords({ company_name, usecase_name, configuration_name, stateSetters, data }) {
    const { word } = data;
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/words/${word}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data.data);
      setLoading(false);

      return response.data.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  }
  async uploadFile({ company_name, usecase_name, configuration_name, stateSetters, data }) {
    const { word, file, content, mode, overwrite } = data;
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);
    if (mode) formData.append('file_type', mode);
    if (overwrite) formData.append('overwrite', overwrite);

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/words/${word}/bulk-upload`,
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
      console.error(error);
      setError(error);
      setLoading(false);
      throw error.response.data.detail;
    }
  }
}

export default WordsRepository;
