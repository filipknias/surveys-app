import React, { useContext } from "react";
// Bootstrap
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
// Context
import { UserContext } from '../context/UserContext';

export default function Profile() {
    // Context
    const [userState, dispatch] = useContext(UserContext);

    return (
        <>
            <Card border="dark">
                <Card.Header className="text-center" as="h4">
                    Profile <span className="green-text">Details</span>
                </Card.Header>
                <Card.Body className="px-md-5">
                    <Tabs 
                        defaultActiveKey="overview" 
                        id="profile-tabs" 
                        className="justify-content-md-center justify-content-between"
                    >
                        <Tab eventKey="overview" title="Overview">
                            <h4 className="mt-4">
                                Overview
                            </h4>
                        </Tab>
                        <Tab eventKey="surveys" title="My Surveys">
                            <h4 className="mt-4">
                                My Surveys
                            </h4>
                        </Tab>
                        <Tab eventKey="edit" title="Edit Profile">
                            <h4 className="mt-4">
                                Edit Profile
                            </h4>
                        </Tab>
                    </Tabs>  
                </Card.Body>
            </Card>
        </>
    )
}
