import axios from 'axios';

class MetadataRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchAttributeValues({ app, attribute_name, stateSetters, data }) {
    // if (!company_name) {
    //   throw new Error('company_name is required');
    // }
    const { setData, setLoading, setError } = stateSetters;
    const search = data.search || '';
    const page = data.page || 1;
    const limit = data.limit || 10;

    const config = {
      url: `${this.baseURL}/companies/${app}/attribute-values?key=${attribute_name}&search=${search}&page=${page}&limit=${limit}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data.values);
      setLoading(false);

      return response.data.values;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  async fetchAttributeNames({ app, stateSetters }) {
    // if (!company_name) {
    //   throw new Error('company_name is required');
    // }
    const { setData, setLoading, setError } = stateSetters;
    // const { role } = data;

    const config = {
      url: `${this.baseURL}/companies/${app}/attribute-list`,
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
    } finally {
      setLoading(false);
    }
  }

  async fetchMetaData({ app, stateSetters, id }) {
    const { setData, setLoading, setError } = stateSetters;

    const config = {
      url: `${this.baseURL}/companies/${app}/metadata?id=${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 3000);

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      throw error;
    }
  }

  async fetchRegionalPrice({ app, stateSetters, id }) {
    const { setData, setLoading, setError } = stateSetters;

    const config = {
      url: `${this.baseURL}/companies/${app}/price?id=${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 3000);

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      throw error;
    }
  }

  //   @metadata_router.get("/{appname}/search")
  // async def get_search(
  //     appname: str,
  //     search: str,
  //     search_on: str = "name",
  //     page: int = 1,
  //     limit: int = 20,

  async lazySearch({ app, stateSetters, data }) {
    const { setData, setLoading, setError } = stateSetters;
    const { search, search_on, page, limit } = data;

    const config = {
      url: `${this.baseURL}/companies/${app}/search?key=${search_on}&search=${search}&page=${page}&limit=${limit}`,
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
    } finally {
      setLoading(false);
    }
  }

  async searchID({ app, id_type, stateSetters, data }) {
    const { id, page } = data;
    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${
        this.baseURL
      }/companies/${app}/search/${id_type}?id=${id}&search=${search}&page=${page}&limit=${12}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
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
}

export default MetadataRepository;
