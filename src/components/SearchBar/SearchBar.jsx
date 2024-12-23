import { useState } from "react";
import { SearchbarfetchCoinData } from "../../services/searchbarfetchdata";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './searchbar.css'
function SearchBar({searchvisible }){


    const[input ,setinput]=useState("")
   
    const [debouncedquery,setdebouncedquery]=useState(input)
    
    const navigate = useNavigate();



    const { data, isLoading, isError, error} = useQuery(['coins',debouncedquery], () => SearchbarfetchCoinData(debouncedquery), {
        // retry: 2,
        // retryDelay: 1000,
        enabled: !!debouncedquery,
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    
    });
 useEffect(() => {
    const handler = setTimeout(() => {
      setdebouncedquery(input);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  function handlecoinRedirect(id) {
    navigate(`/details/${id}`);
}



    return (

        <>
    {searchvisible && (
      <div className="search-bar-container">
            <input
       type="text"
      placeholder="Search..."
      className="input input-bordered input-sm"
      value ={input}
      onChange={(e)=>setinput(e.target.value)}
          />
        {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}

        {data ? (
          
          <div className="search-results">
        <ul>
          {data.map((coin) => (
            <li key={coin.id} onClick={()=>handlecoinRedirect(coin.id)}>{coin.name}</li>

          ))}
        </ul>
        </div>
      ):(<li><a>Nothing</a></li>)}
   </div>
      )}
     </>

    );

}
export default SearchBar;