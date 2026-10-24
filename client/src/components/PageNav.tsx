import { useEffect } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAdvertisers } from "../features/advertisers/advertiserSlice";

interface Crumb {
    label: string;
    to?: string;
}

const ROOT: Crumb = { label: "Advertisers", to: "/" };

// Names come from whatever is already in the store; ids are checked against
// the URL so stale names never show.
function useCrumbs(): Crumb[] {
    const { pathname } = useLocation();
    const advertisers = useAppSelector((state) => state.advertisers.items);
    const advertiser = useAppSelector((state) => state.campaigns.advertiser);
    const campaign = useAppSelector((state) => state.campaigns.selected);
    const line = useAppSelector((state) => state.lines.selected);

    const advertiserName = (id: number) =>
        (advertiser?.id === id ? advertiser : advertisers.find((item) => item.id === id))?.name;

    const advertiserMatch = matchPath("/advertisers/:advertiserId/campaigns", pathname);
    if (advertiserMatch) {
        const id = Number(advertiserMatch.params.advertiserId);
        return [ROOT, { label: advertiserName(id) ?? "Campaigns" }];
    }

    const campaignCrumbs = (campaignId: number, current: boolean): Crumb[] => {
        if (campaign?.id !== campaignId) {
            return [{ label: "Campaign", to: current ? undefined : `/campaigns/${campaignId}` }];
        }
        return [
            {
                label: advertiserName(campaign.advertiser_id) ?? "Campaigns",
                to: `/advertisers/${campaign.advertiser_id}/campaigns`,
            },
            { label: campaign.name, to: current ? undefined : `/campaigns/${campaign.id}` },
        ];
    };

    const campaignMatch = matchPath("/campaigns/:campaignId", pathname);
    if (campaignMatch) {
        return [ROOT, ...campaignCrumbs(Number(campaignMatch.params.campaignId), true)];
    }

    const lineMatch = matchPath("/lines/:lineId", pathname);
    if (lineMatch) {
        const id = Number(lineMatch.params.lineId);
        if (line?.id !== id) {
            return [ROOT, { label: "Line" }];
        }
        return [ROOT, ...campaignCrumbs(line.campaign_id, false), { label: line.name }];
    }

    return [];
}

function PageNav() {
    const dispatch = useAppDispatch();
    const crumbs = useCrumbs();
    const { items, loading, error } = useAppSelector((state) => state.advertisers);

    // Advertiser names back the breadcrumb labels on deep links.
    useEffect(() => {
        if (!items.length && !loading && !error) {
            dispatch(fetchAdvertisers());
        }
    }, [items.length, loading, error, dispatch]);

    if (!crumbs.length) {
        return null;
    }

    const parent = [...crumbs].reverse().find((crumb) => crumb.to);

    return (
        <div className="page-nav">
            <div className="page-nav-inner">
                {parent?.to && (
                    <Link to={parent.to} className="back-button">
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M12.5 4.5 7 10l5.5 5.5" />
                        </svg>
                        <span>
                            Back<span className="back-target"> to {parent.label}</span>
                        </span>
                    </Link>
                )}

                <nav aria-label="Breadcrumb" className="breadcrumbs">
                    <ol>
                        {crumbs.map((crumb, index) => (
                            <li key={index}>
                                {crumb.to ? (
                                    <Link to={crumb.to}>{crumb.label}</Link>
                                ) : (
                                    <span aria-current="page">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
}

export default PageNav;
