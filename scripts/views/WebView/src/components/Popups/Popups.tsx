import React, { useEffect } from "react";
import { PopupConfigType, StateType } from "store/types";
import { deletePopup } from "store/actions";
import { connect } from "react-redux";
import cn from "classnames";
import styles from "./Popups.module.scss";
import { useTimeUp } from "hooks";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PopupProps = PopupConfigType & DispatchProps;

const Popup: React.FC<PopupProps> = ({
  id,
  message,
  popupType,
  deletePopup,
}) => {
  const isTimeUp = useTimeUp(6000);
  useEffect(() => {
    if (isTimeUp) deletePopup(id);
  });
  return (
    <div className={styles.popupWrapper}>
      <div className={cn(styles.popup, styles[`popup__${popupType}`])}>
        {message}
        {isTimeUp}
      </div>
    </div>
  );
};

const MDTP = { deletePopup };

const ConnectedPopup = connect(null, MDTP)(Popup);

const Popups: React.FC<StateProps> = ({ popups }) => {
  return (
    <div className={styles.base}>
      {popups.map(({ id, message, popupType }) => (
        <ConnectedPopup
          key={id}
          id={id}
          message={message}
          popupType={popupType}
        />
      ))}
    </div>
  );
};

const MSTP = ({ root: { popups } }: StateType) => ({ popups });

export default connect(MSTP)(Popups);
