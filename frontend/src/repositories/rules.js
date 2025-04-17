import axios from 'axios';
import sortAndStringify from '../Views/SearchStudio/sortAndStringify';

class RulesRepository {
  // write a init method
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchAllRules({ company_name, usecase_name, ruleset_name, stateSetters, controls }) {
    // give default values to the parameters
    usecase_name = usecase_name || 'primary';
    ruleset_name = ruleset_name || 'primary';
    if (!company_name) {
      throw new Error('company_name is required');
    }
    const { setData, setLoading, setError, setTotalItems } = stateSetters;
    const page = controls.page || 1;
    const limit = controls.limit || 10;
    const search = controls.search || '';
    const sort_parameter = controls.sort_parameter || 'trigger_query';
    const sort_type = controls.sort_type || 'asc';
    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/rulesets/${ruleset_name}/rules?page=${page}&limit=${limit}&search=${search}&sort_parameter=${sort_parameter}&sort_type=${sort_type}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      console.log(response.data.rules);
      setData(response.data.rules);
      setTotalItems(response.data.total_items);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async addRule({ company_name, usecase_name, ruleset_name, stateSetters, data }) {
    if (!company_name) {
      throw new Error('company_name is required');
    }
    usecase_name = usecase_name || 'primary';
    ruleset_name = ruleset_name || 'primary';
    const { setData, setLoading, setError } = stateSetters;
    const { name, matchType, triggerQuery, triggerFilter, consequenceType, consequenceValue } =
      data;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('match_type', matchType);
    formData.append('trigger_query', triggerQuery);
    formData.append('trigger_filter', triggerFilter ? sortAndStringify(triggerFilter) : '');
    formData.append('consequence_type', consequenceType);
    formData.append('consequence_value', consequenceValue);
    formData.append('conflict_resolution', 'override');

    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/rulesets/${ruleset_name}/rules`,
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
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async deleteRule({ company_name, usecase_name, ruleset_name, stateSetters, data }) {
    if (!company_name) {
      throw new Error('company_name is required');
    }
    usecase_name = usecase_name || 'primary';
    ruleset_name = ruleset_name || 'primary';
    const { setData, setLoading, setError } = stateSetters;
    const { matchType, triggerQuery, triggerFilter } = data;
    const formData = new FormData();
    formData.append('match_type', matchType);
    formData.append('trigger_query', triggerQuery);
    formData.append('trigger_filter', triggerFilter ? sortAndStringify(triggerFilter) : '');

    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/rulesets/${ruleset_name}/rules/delete`,
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
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async fetchAllConsequences({ company_name, usecase_name, ruleset_name, stateSetters, data }) {
    if (!company_name) {
      throw new Error('company_name is required');
    }
    usecase_name = usecase_name || 'primary';
    ruleset_name = ruleset_name || 'primary';
    const { setData, setLoading, setError } = stateSetters;
    const { triggerQuery, triggerFilter, matchType } = data;
    const formData = new FormData();
    formData.append('trigger_query', triggerQuery);
    formData.append('trigger_filter', triggerFilter ? sortAndStringify(triggerFilter) : '');
    formData.append('match_type', matchType);
    const config = {
      url: `${this.baseURL}/rdis/companies/${company_name}/usecases/${usecase_name}/rulesets/${ruleset_name}/consequences`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };
    setLoading(true);
    try {
      const response = await axios(config);
      console.log(response.data.consequences);
      setData(response.data.consequences);
      setLoading(false);
      return response.data.consequences;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }
}

export default RulesRepository;
