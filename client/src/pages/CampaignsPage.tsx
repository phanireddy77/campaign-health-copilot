import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCampaignsByAdvertiser } from "../features/campaigns/campaignSlice";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatFlight } from "../utils/formatters";
import { toneFor } from "../utils/tones";

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
        return <p className="state-message">Loading campaigns...</p>;
    }
    if (error) {
        return <p className="state-message state-error" role="alert">{error}</p>
    }
    return (
        <section>
            <div className="page-header">
                <h2>
                    {advertiser?.name}
                </h2>
                <p className="page-subtitle">
                    {advertiser?.industry}
                    {advertiser?.industry && " · "}
                    {items.length} {items.length === 1 ? "campaign" : "campaigns"}
                </p>
            </div>

            <div className="card-grid">
                {items.map((campaign) => (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className={`card card-link card-accent tint-${toneFor(campaign.id)}`}
                    >
                        <span className="card-heading">
                            <span className="card-title">{campaign.name}</span>
                            <StatusBadge value={campaign.status} />
                        </span>
                        <dl className="card-facts">
                            <div>
                                <dt>Budget</dt>
                                <dd>{formatCurrency(Number(campaign.budget))}</dd>
                            </div>
                            <div>
                                <dt>Flight</dt>
                                <dd>{formatFlight(campaign.start_date, campaign.end_date)}</dd>
                            </div>
                        </dl>
                    </Link>
                ))
                }
            </div>
        </section>
    )
}

export default CampaignsPage;
