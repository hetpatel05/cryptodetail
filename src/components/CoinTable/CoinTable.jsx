import { useState } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "react-query";
// import { CurrencyContext } from "../../context/CurrencyContext";
import currencyStore from '../../state/store';
import { useNavigate } from "react-router-dom";
import PageLoader from "../PageLoader/PageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";
function CoinTable() {
    const [coins, setCoins] = useState([]);
    const { currency } = currencyStore();
const [hasmore,sethasmore]=useState(true);
    const navigate = useNavigate();

    const [page,setpage] = useState(1);
    const { data, isLoading, isError, error} = useQuery(['coins', page, currency], () => fetchCoinData(page, currency), {
        // retry: 2,
        // retryDelay: 1000,
        keepPreviousData:true,
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    });
    useEffect(() => {
        if (data) {
            setCoins(prevCoins => [...prevCoins, ...data]);
            if (data.length==0) {
                sethasmore(false); // Stop fetching if no more data is available
            }
        }
    }, [data]);


    function handleCoinRedirect(id) {
        navigate(`/details/${id}`);
    }
    function fetchmoredata(){


        
        setTimeout(()=>{
         setpage(currentPage => currentPage + 1)
        },1000)

    }

    if(isError) {
        return <div>Error: {error.message}</div>;
    }

    if(isLoading) {
        return <PageLoader />
    }
    
    return (
        <div className="my-5 flex flex-col items-center justify-center gap-5 w-[80vw] mx-auto">
            <div className="w-full bg-yellow-400 text-black flex py-4 px-2 font-semibold items-center justify-center">
                {/* Header of the table */}
                <div className="basis-[35%]">
                    Coin 
                </div>
                <div  className="basis-[25%]">
                    Price 
                </div>
                <div  className="basis-[20%]">
                    24h change 
                </div>
                <div  className="basis-[20%]">
                    Market Cap
                </div>
            </div>

            <InfiniteScroll
              
            dataLength={coins.length}
            next={fetchmoredata}
            hasMore={hasmore}
            loader={<p>loading</p>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            
            >

            <div className="flex flex-col w-[80vw] mx-auto">
                {isLoading && <div>Loading...</div>}
                {coins && coins.map((coin) => {
                    return (
                        <div onClick={() => handleCoinRedirect(coin.id)} key={coin.id} className="w-full bg-transparent text-white flex py-4 px-2 font-semibold items-center justify-between cursor-pointer">
                            <div className="flex items-center justify-start gap-3 basis-[35%]">

                                <div className="w-[5rem] h-[5rem]">
                                    <img src={coin.image} className="w-full h-full" loading="lazy"/>
                                </div>

                                <div className="flex flex-col"> 
                                    <div className="text-3xl">{coin.name}</div>
                                    <div className="text-xl">{coin.symbol}</div>
                                </div>


                            </div>

                            <div className="basis-[25%]">
                                {coin.current_price}
                            </div>
                            <div className="basis-[20%]">
                                {coin.price_change_24h}
                            </div>
                            <div className="basis-[20%]">
                                {coin.market_cap}
                            </div>
                        </div>
                    );
                })}
            </div>
           </InfiniteScroll>


         
        </div>
    )
}

export default CoinTable;