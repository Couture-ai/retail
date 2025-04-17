import axios from 'axios';

class UserRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async uploadFile({ stateSetters, data }) {
    const { name, resources } = data;

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (resources) formData.append('resources', resources);

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/resources`,
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
    }
  }

  async login({ stateSetters, data }) {
    const { username, password } = data;

    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);

    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/app/login`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      setLoading(false);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('roles', JSON.stringify(response.data.roles));
      localStorage.setItem('resources', JSON.stringify(response.data.resources));
      localStorage.setItem('role', 'admin');

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      throw error;
    }
  }
}

export default UserRepository;
