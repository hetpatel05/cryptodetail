import axiosInstance from "../helpers/axiosInstance";

export async function SearchbarfetchCoinData(searchText) {
 
    try {
        const response = await axiosInstance.get(`/search?query=${searchText}`);
     const data=response.data.coins;
     const coindata=data.length>10?data.slice(0,10):data;
     console.log(coindata)
     return coindata;

    } catch(error) {
        console.error(error);
        return[];
    }
}