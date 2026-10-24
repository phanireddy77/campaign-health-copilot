import { Link, matchPath, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface Crumb {
    label: string;
    to?: string;
}

const ROOT: Crumb = { label: "Advertisers", to: "/" };

// Names come from whatever the current page has already loaded into the
// store; ids are checked against the URL so stale names never show.
function useCrumbs(): Crumb[] {
    const { pathname } = useLocation();
    const advertiser = useAppSelector((state) => state.campaigns.advertiser);
    const campaign = useAppSelector((state) => state.campaigns.selected);
    const line = useAppSelector((state) => state.lines.selected);

    const advertiserMatch = matchPath("/advertisers/:advertiserId/campaigns", pathname);
    if (advertiserMatch) {
        const id = Number(advertiserMatch.params.advertiserId);
        return [ROOT, { label: advertiser?.id === id ? advertiser.name : "Campaigns" }];
    }

    const campaignCrumbs = (campaignId: number, current: boolean): Crumb[] => {
        if (campaign?.id !== campaignId) {
            return [{ label: "Campaign", to: current ? undefined : `/campaigns/${campaignId}` }];
        }
        return [
            {
                label: advertiser?.id === campaign.advertiser_id ? advertiser.name : "Campaigns",
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

function Breadcrumbs() {
    const crumbs = useCrumbs();

    if (!crumbs.length) {
        return null;
    }

    return (
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
    );
}

export default Breadcrumbs;
