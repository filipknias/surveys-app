import React from "react";
// Bootstrap
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
// Components
import Overview from "../components/profile/Overview";

export default function Profile(props) {
    const userId = props.match.params.userId;

    return (
        <Card border="dark">
            <Card.Header className="text-center" as="h4">
                Profile <span className="green-text">Details</span>
            </Card.Header>
            <Card.Body className="px-md-5">
                <Tabs 
                    defaultActiveKey="overview" 
                    id="profile-tabs" 
                    className="mb-5"
                >
                    <Tab eventKey="overview" title="Overview">
                        <Overview userId={userId} />
                    </Tab>
                    <Tab eventKey="surveys" title="Surveys">
                        <h4>
                            Surveys
                        </h4>
                    </Tab>
                </Tabs>  
            </Card.Body>
        </Card>
    )
}
