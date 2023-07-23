import React, { useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setViewedImageIndex } from "store/actions";
import cn from "classnames";
import styles from "./ImagesViewer.module.scss";
import { Arrow } from "components/widgets";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImageInfo: React.FC<ImageViewerProps> = ({ info, viewedImageIndex }) => {
  const [isHidden, setHidden] = useState(true);
  if (!info) return null;
  const {
    all_seeds,
    all_prompts,
    all_negative_prompts,
    width,
    height,
    sampler_name,
    cfg_scale,
    steps,
    // infotexts,
  } = info;
  // console.log(infotexts[viewedImageIndex]);

  const infoRows: [string, string][] = [
    ["Seed", `${all_seeds[viewedImageIndex]}`],
    ["Prompt", all_prompts[viewedImageIndex]],
    ["Negative prompt", all_negative_prompts[viewedImageIndex]],
    ["Size", `${width} x ${height}`],
    ["Sampler", sampler_name],
    ["CFG scale", `${cfg_scale}`],
    ["Steps", `${steps}`],
  ];

  return (
    <div
      className={cn(styles.info, isHidden && styles.info__hidden)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div
        className={cn(
          styles.info_container,
          isHidden && styles.info_container__hidden
        )}
      >
        <div className={styles.info_title}>Info</div>
        <div className={styles.info_wrapper}>
          {infoRows.map(([key, value]) => (
            <div className={styles.info_row} key={key}>
              <div className={styles.info_key}>{key}</div>
              <div className={styles.info_value}>{value}</div>
            </div>
          ))}
        </div>
        <Arrow
          onPointerDown={(event) => {
            event.stopPropagation();
            setHidden((value) => !value);
          }}
          isOn={!isHidden}
          position="right"
          customClass={styles.info_arrow}
        />
      </div>
    </div>
  );
};

const MSTP = ({ result: { info, viewedImageIndex } }: StateType) => ({
  info,
  viewedImageIndex,
});

const MDTP = { setViewedImageIndex };

export default connect(MSTP, MDTP)(ImageInfo);
