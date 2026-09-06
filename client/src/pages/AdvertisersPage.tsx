import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchAdvertisers } from "../features/advertisers/advertiserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

function AdvertisersPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector(
        (state) => state.advertisers
    );
    useEffect(()=>{
        dispatch(fetchAdvertisers());
    },[dispatch]);

    if (loading) {
        return <p> Loading...</p>;
    }
    if (error) {
        return <p style={{color:'red'}}>{error}</p>
    }
    return (
        <section>
           <h2>Advertisers</h2>
            {items.map((advertiser) => (
                <article key={advertiser.id}>
                    <h3>
                        <Link to={`/advertisers/${advertiser.id}/campaigns`}>
                         {advertiser.name}
                        </Link>
                    </h3>
                    <p>
                        {advertiser.industry}
                    </p>
                </article>
            ))}
        </section>
    );
}

export default AdvertisersPage;