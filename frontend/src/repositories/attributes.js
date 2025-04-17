import axios from 'axios';

class AttributesRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchAttributes({ company_name, usecase_name, configuration_name, stateSetters }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      console.log(response.data.attributes);
      setData(
        response.data.attributes.reduce((acc, attribute) => {
          acc[attribute.name] = attribute;
          return acc;
        }, {})
      );
      setLoading(false);

      return response.data.attributes.reduce((acc, attribute) => {
        acc[attribute.name] = attribute;
        return acc;
      }, {});
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async addAttribute({ company_name, usecase_name, configuration_name, stateSetters, attribute }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const { name, searchable, fetchable, facetable, filterable, dataType } = attribute;
    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name,
        searchable,
        fetchable,
        facetable,
        filterable,
        data_type: dataType
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async updateAttribute({
    company_name,
    usecase_name,
    configuration_name,
    stateSetters,
    attribute,
    attributeID
  }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const { name, searchable, fetchable, facetable, filterable, dataType } = attribute;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('searchable', searchable);
    formData.append('fetchable', fetchable);
    formData.append('facetable', facetable);
    formData.append('filterable', filterable);
    formData.append('data_type', dataType);
    formData.append('attribute_id', attributeID);
    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes`,
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
    } catch (error) {
      console.error(error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async deleteAttribute({
    company_name,
    usecase_name,
    configuration_name,
    stateSetters,
    attributeID
  }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes/${attributeID}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async bulkAddAttributes({
    company_name,
    usecase_name,
    configuration_name,
    stateSetters,
    file,
    options
  }) {
    // check if file is json or csv
    if (!file) {
      throw new Error('file is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const force = options.force || false;
    const conflictResolution = options.conflictResolution || 'preserve';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('force', force);
    formData.append('conflict_resolution', conflictResolution);

    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes/bulk`,
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
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async resetAttributes({ company_name, usecase_name, configuration_name, stateSetters }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    configuration_name = configuration_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}/companies/${company_name}/usecases/${usecase_name}/configurations/${configuration_name}/attributes/reset`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }
}

export default AttributesRepository;
