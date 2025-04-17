import { Icon } from '@mui/material';

const headers = [
  {
    column_name: 'NAME',
    data_id: 'data_id',
    data_type: 'object', // string, number, date, boolean, object, string[], object[],
    column_span: 1, // [optional] default 1
    style: {
      color: 'red', // [optional] default 'black'
      backgroundColor: 'blue' // [optional] default 'white'
    },
    render_class: Object, //[optional uness data_type is object] default as per string,
    options: {
      has_options: true, // [optional] default false
      options: {
        option1: {
          color: 'red',
          backgroundColor: 'blue',
          icon: Icon
        }
      }
    },
    search: {
      searchable: true, // [optional] default false,
      search_query: '', // [optional] default '' STATE_VARIABLE
      saperate_search: false // [optional] default false ||| if true then show seachbox in filter dropdown else common global search
    }, // [optional] default false

    sort: {
      sortable: true, // [optional] default false,
      sort_order: 'asc' // [optional] default 'asc' 'asc'/'dsc'/null STATE_VARIABLE
    },
    filter: {
      filterable: true, // [optional] default false,
      descrete: {
        is_descrete: true, // [optional] default false
        options: ['option1', 'option2'], // [optional] default []
        filter_options: [], // [optional] default [] STATE_VARIABLE
        multiple: true // [optional] default false
      },
      range: {
        is_range: true, // [optional] default false
        filter_range: [] // [optional] default [] STATE_VARIABLE
      }
    },
    show_in_table: true // [optional] default true STATE_VARIABLE
  }
];
const table_configuration = {
  actions: {
    show_actions: true,
    actions: [
      {
        name: 'Add',
        action: () => {},
        type: 'table' // add new row, open modal
      },
      {
        name: 'Delete',
        action: () => {},
        type: 'table' // delete selected
      },
      {
        name: 'Save',
        action: () => {},
        type: 'table' // save all
      },
      {
        name: 'Edit',
        action: () => {},
        type: 'row' // open modal to edit row
      },
      {
        name: 'Download',
        action: () => {},
        type: 'table' // download table data
      }
    ]
  },
  page: {
    page_size: 10, // [optional] default 10 STATE_VARIABLE
    page_number: 1 // [optional] default 1 STATE_VARIABLE
  },
  modes: {
    select: {
      select_mode: true, // [optional] default false STATE_VARIABLE,
      selected_rows: [] // [optional] default [] STATE_VARIABLE
    }
  }
};
