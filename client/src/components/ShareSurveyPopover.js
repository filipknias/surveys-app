import React, { useState, useRef } from "react";
// Bootstrap
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
// Images
import ShareIcon from "../components/img/share-icon.svg";

export default function ShareSurveyPopover() {
  // State
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  // Refs
  const shareSurveyRef = useRef();

  // Share survey popover
  const shareSurveyPopover = () => {
    return (
      <Popover id="share-survey-popover">
        <Popover.Title className="text-center">Share your survey</Popover.Title>
        <Popover.Content className="d-flex">
          <Form.Control
            type="text"
            readOnly
            value={window.location.href}
            ref={shareSurveyRef}
          />
          <Button variant="primary" className="ml-3" onClick={handleCopyLink}>
            {copiedToClipboard ? "Copied" : "Copy"}
          </Button>
        </Popover.Content>
      </Popover>
    );
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    shareSurveyRef.current.select();
    shareSurveyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setCopiedToClipboard(true);
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={shareSurveyPopover()}
      onToggle={() => setCopiedToClipboard(false)}
    >
      <Button type="button" variant="secondary" className="px-5">
        <Image src={ShareIcon} height="18" className="mr-2" />
        Share
      </Button>
    </OverlayTrigger>
  );
}
