import React from "react";
import { Link } from "react-router-dom";
// Bootstrap
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
// Images
import ProfileAvatar from '../img/profile-avatar.svg';

export default function ProfilePopover({ user }) {

    // Link styles
    const profileLinkStyles = {
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    // Profile popover
    const profilePopover =  (
        <Popover id="profile-popover">
            <Popover.Content>
                <div className="d-flex flex-column align-items-center text-center">
                    <Image src={ProfileAvatar} height="50" className="mb-2" />
                    <div>
                        <div>
                            <span className="profile-label">Display name</span>
                            <h6>{user.displayName}</h6>
                        </div>
                        <div>
                            <span className="profile-label">E-mail</span>
                            <h6>{user.email}</h6>
                        </div>
                    </div>
                </div>
                <Link to={`/users/${user._id}`}>
                    <Button variant="primary" size="sm" className="mt-2" block>Visit profile</Button>
                </Link>
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={profilePopover}
        >
            <span style={profileLinkStyles}>
                {user.displayName}
            </span>
        </OverlayTrigger>
    );
}
