import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchLineById } from "../features/lines/lineSlice";

function LineDetailsPage (){

    const { lineId } = useParams();
    const line = useAppSelector((state)=> state.lines.selected);
    const dispatch = useAppDispatch();

    useEffect(()=>{
        const id = Number(lineId);
        dispatch(
            fetchLineById(id)
        );
    },[lineId, dispatch]);

    if(!line) {
        return <p>Line is loading...</p>
    }
    return (
        <section>
            <h2>
                {line.name}
            </h2>
            <p>
                Status: {line.status}
            </p>
            <p>
                Budget: $
                {Number(
                line.budget
                ).toLocaleString()}
            </p>
            <p>
                Daily Budget: $
                {Number(
                line.daily_budget || 0
                ).toLocaleString()}
            </p>
            <p>
                Goal Type: {line.goal_type}
            </p>
            <p>
                Goal Value: {line.goal_value}
            </p>
            <p>
                Flight:
                {" "}
                {line.start_date}
                {" → "}
                {line.end_date}
            </p>
            <h3>Performance</h3>
            <p>
                Metrics dashboard arrives on Day 5.
            </p>
        </section>
    )
}
export default LineDetailsPage;