import axios from 'axios';
import './App.css'
import React, {useEffect,useState} from 'react';
import { useHistory } from "react-router-dom";
// import './styles.css';
import  data from './data';
const products=
[
  { id: 1, name: 'Cheese', price: 4.9, stock: 20 },
  { id: 2, name: 'Milk', price: 1.9, stock: 32 },
  { id: 3, name: 'Yoghurt', price: 2.4, stock: 12 },
  { id: 4, name: 'Heavy Cream', price: 3.9, stock: 9 },
  { id: 5, name: 'Butter', price: 0.9, stock: 99 },
  { id: 6, name: 'Sour Cream ', price: 2.9, stock: 86 },
  { id: 7, name: 'Fancy French Cheese 🇫🇷', price: 99, stock: 12 }
]

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const ProductTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <table>
      <caption>Products</caption>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort('name')}
              className={getClassNamesFor('name')}
            >
              Name
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('year_of_experience')}
              className={getClassNamesFor('year_of_experience')}
            >
              year_of_experience
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('position_applied')}
              className={getClassNamesFor('position_applied')}
            >
              position_applied
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('application_date')}
              className={getClassNamesFor('application_date')}
            >
              application_date
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>${item.year_of_experience}</td>
            <td>{item.position_applied}</td>
            <td>{item.application_date}</td>
            <td>{item.email}</td>
            <td>{item.birth_date}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const usefilter=(event)=> {
//   const [filteredData, setFiltered]=React.useState('');
//   const value = event.target.value;
//   const regex = new RegExp(escapeRegExp(value), "i");
//   const filtered = products.filter(item => {
//     return item.match(regex);
//   });
//   setFiltered(filtered);

//   return filteredData;
// }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export default function App(props) {

  const [filteredData, setFiltered]=useState([]);
  const [data ,setData]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error, setError]=useState('');
  const [statusFilters,setStatusFilters]=useState(["approved","rejected","waiting"]);
  const [checkedArr,setCheckedArr]=useState([true, true,true]);
  const [searchOnName,setsearchOnName]=useState('');
  const [searchOnPosition,setSearchOnPosition]=useState('');
  const params =new URLSearchParams(window.location.search);

  const history=useHistory();
  
    useEffect(()=>{
      
      console.log('window.location.search',params.get('name'));
      console.log('window.location.search',params.get('position'));
      console.log('window.location.search',params.get('filters'));
      
      setSearchOnPosition(params.get('position'));
      setsearchOnName(params.get('name'));
     
      setLoading(true);
      setError('');
          axios.get('http://personio-fe-test.herokuapp.com/api/v1/candidates')
          .then((res)=>{
            console.log('data',res.data);
             res.data.data && setFiltered(res.data.data); setData(res.data.data);
             res.data.error && setError(res.data.error.message);

            setLoading(false);
          })
          .catch((err)=>{  console.log('data',err); })
    },[])

      const statusFilter=(e,index)=>{
        var filters=checkedArr;
            filters[index]=!filters[index]

        setCheckedArr(filters);
        console.log(checkedArr);
        filters=[];
      //  console.log(checkedArr);
      //  checkedArr.forEach((item)=>{
      //       item && filters.push(e.target.value);
      //  })

        checkedArr[0]&&filters.push('approved');
        checkedArr[1]&&filters.push('rejected')
        checkedArr[2]&&filters.push('waiting')

        setStatusFilters(filters);

        history.push({
          pathname: '/',
          search: `?name=${searchOnName}&position=${searchOnPosition}&filters=${JSON.stringify(filters)}`
        })

        console.log(filters);
        // console.log(statusFilters);
        // var arr1 = ['1','2','3','4'],
        // arr2 = ['2','4'],
      let res = filteredData.filter(item => filters.includes(item.status));
        setFiltered(res);
        console.log(res);
      }

  const filter=(col)=>(event)=> {

    if (col === 'name') {setsearchOnName(event.target.value)};
    if (col === 'position_applied') {setSearchOnPosition(event.target.value)};

    history.push({
      pathname: '/',
      search: `?name=${searchOnName}&position=${searchOnPosition}&filters=${JSON.stringify(statusFilters)}`
    })
  
    const value = event.target.value;
    console.log('col',col);
    const regex = new RegExp(escapeRegExp(value),'i');
    // console.log('reg ex val ',regex);
    const filtered = filteredData.filter(item => { console.log('col  val ',item[col]);
      return item[col].match(regex);
    });
    setFiltered(filtered);
    // return filteredData;

  }

  const refresh=()=>{

    setFiltered(data);
    setSearchOnPosition('');
    setsearchOnName('');
    setCheckedArr([true,true,true]);
    setStatusFilters(["approved","rejected","waiting"]);

    history.push({
      pathname: '/',
      search: `?name=${searchOnName}&position=${searchOnPosition}&filters=${JSON.stringify(statusFilters)}`
    })

  }

  return (
    <div className="App">
      <button onClick={refresh}>refresh </button>
      <div>
        Filter on Name
        <input value={searchOnName} type="search" onChange={filter('name')} />
      </div>
      <div>
        Filter on Position applied
        <input value={searchOnPosition} type="search" onChange={filter('position_applied')}  />
      </div>
      <div>
        Filter on status
        <div > 
          Approved
            <input
                type="checkbox"
                value={'approved'}
                checked={checkedArr[0]}
                onChange={(e)=>{statusFilter(e,0);}}
              />
              Rejected
              <input
                type="checkbox"
                value={'rejected'}
                checked={checkedArr[1]}
                onChange={(e)=>{statusFilter(e,1)}}
              />
          Waiting
              <input
                type="checkbox"
                value={'waiting'}
                checked={checkedArr[2]}
                onChange={(e)=>{statusFilter(e,2)}}
             
              />
             </div > 
          </div>
        {error}
        {!loading?( <ProductTable
        products={filteredData}
      />):( <div>Please wait until we get data fom backend  .... !</div>)}
     
    </div>
  );
}

