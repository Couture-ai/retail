const usePreFetchPagination = ({ fetch, pageSize, prefetchSize }) => {
  const [page, setPage] = useState(1);
  const [innerpage, setInnerPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    // if already exists in data
    if (data.length >= page * pageSize) {
      setPaginatedData(data.slice((page - 1) * pageSize, page * pageSize));
      return;
    }
    fetch(innerpage, prefetchSize)
      .then((res) => {
        setData([...data, ...res]);
        setPaginatedData(data.slice((page - 1) * pageSize, page * pageSize));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return { page, setPage, paginatedData };
};

const useAdHocPagination = ({ fetch, pageSize }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    if (data[page]) {
      setPaginatedData(data[page]);
      return;
    }
    fetch(page, pageSize)
      .then((res) => {
        setData({ ...data, [page]: res });
        setPaginatedData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return { page, setPage, paginatedData };
};
