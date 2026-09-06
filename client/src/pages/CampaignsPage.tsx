import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCampaignsByAdvertiser } from "../features/campaigns/campaignSlice";

function CampaignsPage() {
    const { advertiserId } = useParams();
    const dispatch = useAppDispatch();
    const { items, loading, error, advertiser } = useAppSelector((state) => state.campaigns);

    useEffect(()=> {
        const id = Number(advertiserId);
        if (Number.isInteger(id)) {
            dispatch(
                fetchCampaignsByAdvertiser(id)
            );
        }
    },[advertiserId,dispatch]);
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p style={{color:'red'}}>{error}</p>
    }
    return (
        <section>
            <Link to="/">
                ← Advertisers
            </Link>
            <h2>
                {advertiser?.name}
            </h2>

            <h3>Campaigns</h3>
            {items.map((campaign) => (
                <article key={campaign.id}>
                    <h4>
                        <Link
                        to={`/campaigns/${campaign.id}`}
                        >
                        {campaign.name}
                        </Link>
                    </h4>
                    <p>
                        Status: {campaign.status}
                    </p>
                    <p>
                        Budget: $
                        {Number(
                        campaign.budget
                        ).toLocaleString()}
                    </p>
                    <p>
                        {campaign.start_date}
                        {" → "}
                        {campaign.end_date}
                    </p>
                </article>
            ))
            }
        </section>
    )
}

export default CampaignsPage;