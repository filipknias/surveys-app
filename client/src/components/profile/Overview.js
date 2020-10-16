import React, { useState, useEffect } from "react";
import axios from 'axios';
// Bootstrap
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
// Components
import Error from '../Error';
// Images
import ProfileAvatar from '../img/profile-avatar.svg';
import SurveysStatsImage from '../img/surveys-stats-image.svg';
import ActiveSurveysIcon from '../img/active-surveys-icon.svg';
import ClosedSurveysIcon from '../img/closed-surveys-icon.svg';

export default function Overview({ userId }) {
    // State
    const [user, setUser] = useState({});
    const [surveys, setSurveys] = useState([]);
    const [activeSurveysCount, setActiveSurveysCount] = useState(null);
    const [closedSurveysCount, setClosedSurveysCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get surveys by given user
    useEffect(() => {
        // Start loading
        setLoading(true);
        axios.get(`/api/users/${userId}`)
            .then(res => {
                // Set user
                setUser(res.data);
                // Stop loading
                setLoading(false);
            })
            .catch(err => {
                // Set error
                setError(err.response.data.error);
                // Stop loading
                setLoading(false);
            })

        axios.get(`/api/surveys/${userId}`)
            .then(res => {
                // Set surveys
                setSurveys(res.data);
                // Stop loading
                setLoading(false);
            })
            .catch(err => {
                // Set error
                setError(err.response.data.error);
                // Stop loading
                setLoading(false);
            })
    }, []);

    // Count surveys based on their status
    useEffect(() => {
        // Set active surveys count
        const activeSurveys = surveys.filter((survey) => {
            return survey.status === "public";
        });
        setActiveSurveysCount(activeSurveys.length);

        // Set closed surveys count
        const closedSurveys = surveys.filter((survey) => {
            return survey.status === "closed";
        });
        setClosedSurveysCount(closedSurveys.length);
    }, [surveys]);

    return (
        <>  
            {error ? (
                <Error message={error} />
            ) : (
                <>
                    {loading ? (
                        <Spinner animation="border" className="mx-auto d-block" />
                    ) : (
                        <>
                            <section>
                                <h3 className="mb-4 text-center text-md-left">Profile</h3>
                                <div className="
                                    d-flex 
                                    flex-column 
                                    flex-md-row 
                                    align-items-center 
                                    align-items-md-start 
                                    text-center 
                                    text-md-left"
                                >
                                    <Image src={ProfileAvatar} height="140" />
                                    <div className="mt-4 mt-md-0 ml-md-4">
                                        <div className="mb-3">
                                            <span className="profile-label">Display name</span>
                                            <h3>{user.displayName}</h3>
                                        </div>
                                        <div>
                                            <span className="profile-label">E-mail</span>
                                            <h3>{user.email}</h3>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-5 mb-3">
                                <h3 className="mb-4 text-center text-md-left">Surveys Statistics</h3>
                                <div className="
                                    d-flex 
                                    flex-column 
                                    flex-md-row 
                                    align-items-center 
                                    align-items-md-start 
                                    text-center 
                                    text-md-left 
                                    mt-4"
                                >
                                    <Image src={SurveysStatsImage} height="140" />
                                    <div className="mx-4 mt-4 mt-md-0">
                                        <p className="profile-label text-center">Created surveys</p>
                                        <div className="d-flex mt-2">
                                            <div className="mr-4">
                                                <div className="d-flex">
                                                    <Image src={ActiveSurveysIcon} height="30" className="mr-2" />
                                                    <h4>{activeSurveysCount}</h4>
                                                </div>
                                                <p className="profile-label text-center mt-1">Active</p>
                                            </div>
                                            <div>
                                                <div className="d-flex">
                                                    <Image src={ClosedSurveysIcon} height="30" className="mr-2" />
                                                    <h4>{closedSurveysCount}</h4>
                                                </div>
                                                <p className="profile-label text-center mt-1">Closed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </>
            )}
        </>
    )
}
