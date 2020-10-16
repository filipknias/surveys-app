import React, { useContext } from "react";
// Bootstrap
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
// Components
import AuthError from "../components/AuthError";
import Overview from "../components/profile/Overview";
// Context
import { UserContext } from '../context/UserContext';

export default function Profile(props) {
    // Context
    const [userState, dispatch] = useContext(UserContext);

    const userId = props.match.params.userId;

    return (
        <>
            {!userState.isAuth ? (
                <AuthError />
            ) : (
                <Card border="dark">
                    <Card.Header className="text-center" as="h4">
                        Profile <span className="green-text">Details</span>
                    </Card.Header>
                    <Card.Body className="px-md-5">
                        <Tabs 
                            defaultActiveKey="overview" 
                            id="profile-tabs" 
                            className="justify-content-md-center justify-content-between mb-5"
                        >
                            <Tab eventKey="overview" title="Overview">
                                <Overview userId={userId} />
                            </Tab>
                            <Tab eventKey="surveys" title="Surveys">
                                <h4>
                                    Surveys
                                </h4>
                            </Tab>
                            <Tab eventKey="edit" title="Edit Profile">
                                <h4>
                                    Edit Profile
                                </h4>
                            </Tab>
                        </Tabs>  
                    </Card.Body>
                </Card>
            )}
        </>
    )
}
