import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";
// Components
import Overview from "../components/profile/Overview";
import ProfileSurveys from "../components/profile/ProfileSurveys";
import Error from "../components/Error";

export default function Profile(props) {
  // State
  const [user, setUser] = useState({});
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = props.match.params.userId;

  // Fetch all data
  useEffect(() => {
    // Start loading
    setLoading(true);
    axios
      .get(`/api/users/${userId}`)
      .then((res) => {
        // Set user
        setUser(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setLoading(false);
      });

    axios
      .get(`/api/surveys/get?author=${userId}`)
      .then((res) => {
        // Set response
        setResponse(res.data);
        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Set error
        setError(err.response.data.error);
        // Stop loading
        setLoading(false);
      });
  }, []);

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <Card border="dark">
          <Card.Header className="text-center" as="h4">
            Profile <span className="green-text">Details</span>
          </Card.Header>
          <Card.Body className="px-md-5">
            {loading ? (
              <Spinner animation="border" className="mx-auto d-block" />
            ) : (
              <>
                {response.results && (
                  <Tabs
                    defaultActiveKey="overview"
                    id="profile-tabs"
                    className="mb-5"
                  >
                    <Tab eventKey="overview" title="Overview">
                      <Overview user={user} surveys={response.results} />
                    </Tab>
                    <Tab eventKey="surveys" title="Surveys">
                      <ProfileSurveys user={user} history={props.history} />
                    </Tab>
                  </Tabs>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
