import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchAdvertisers } from "../features/advertisers/advertiserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { initials, toneFor } from "../utils/tones";

function AdvertisersPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector(
        (state) => state.advertisers
    );
    useEffect(()=>{
        dispatch(fetchAdvertisers());
    },[dispatch]);

    if (loading) {
        return <p className="state-message">Loading advertisers...</p>;
    }
    if (error) {
        return <p className="state-message state-error" role="alert">{error}</p>
    }
    return (
        <section>
            <div className="page-header">
                <h2>Advertisers</h2>
                <p className="page-subtitle">
                    Choose an advertiser to review the health of its campaigns.
                </p>
            </div>
            <div className="card-grid">
                {items.map((advertiser) => (
                    <Link
                        key={advertiser.id}
                        to={`/advertisers/${advertiser.id}/campaigns`}
                        className={`card card-link advertiser-card tint-${toneFor(advertiser.id)}`}
                    >
                        <span className="avatar" aria-hidden="true">
                            {initials(advertiser.name)}
                        </span>
                        <span className="card-title">{advertiser.name}</span>
                        <span className="card-subtitle">{advertiser.industry}</span>
                        <span className="card-cta">View campaigns →</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default AdvertisersPage;
