import React from "react";
import { Session } from "../Models/Session";

interface IProps {
    session: Session;
}
export const SessionCard: React.FunctionComponent<IProps> = (
    props: IProps
): JSX.Element => {
    const { session } = props;
    return (
        <>
            <div id="sessionList" className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h5>{session.name}</h5>
                        <div className="card-subtitle">{session.pincode}</div>
                        <div className="card-subtitle">
                            {session.block_name}
                        </div>
                        <div className="card-subtitle">{session.pincode}</div>
                    </div>
                    <div className="card-text">
                        {session.available_capacity}
                    </div>
                    <div className="card-text">{session.vaccine}</div>
                    <p className="card-text">{session.slots}</p>
                </div>
            </div>
        </>
    );
};
