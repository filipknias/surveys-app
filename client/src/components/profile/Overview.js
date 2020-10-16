import React, { useContext } from "react";
// Bootstrap
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
// Images
import ProfileAvatar from '../img/profile-avatar.svg';
// Context
import { UserContext } from '../../context/UserContext';
// Reducer types
import { CLEAR_USER } from '../../reducers/types';

export default function Overview({ userId }) {
    // Context
    const [userState, dispatch] = useContext(UserContext);

    // Log out user
    const handleLogout = () => {
    dispatch({ type: CLEAR_USER });
    localStorage.removeItem("auth-token");
    };

    return (
        <>  
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-left">
                <Image src={ProfileAvatar} height="140" />
                <div className="mt-4 mt-md-0 ml-md-3">
                    <div className="mb-3">
                        <span className="profile-label">Display name</span>
                        <h3>{userState.user.displayName}</h3>
                    </div>
                    <div>
                        <span className="profile-label">E-mail</span>
                        <h3>{userState.user.email}</h3>
                    </div>
                </div>
            </div>
            {userState.user._id === userId && (
                <Button 
                    variant="primary" 
                    onClick={handleLogout}
                    className="mt-5 mb-3"
                    size="lg"
                >
                    Log Out
                </Button>
            )}
        </>
    )
}
