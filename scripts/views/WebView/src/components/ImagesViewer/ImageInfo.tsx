import React, { useState, useEffect } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setViewedImageIndex, setInputImageViewOpacity } from "store/actions";
import cn from "classnames";
import styles from "./ImagesViewer.module.scss";
import { Arrow } from "components/widgets";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImageInfo: React.FC<ImageViewerProps> = ({
  info,
  viewedImageIndex,
  inputImageViewOpacity,
  setInputImageViewOpacity,
}) => {
  const [isHidden, setHidden] = useState(true);
  useEffect(
    () => () => {
      setInputImageViewOpacity(0);
    },
    [setInputImageViewOpacity]
  );
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
    input_image,
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

  const onSliderInput = (event: React.FormEvent<HTMLInputElement>) =>
    setInputImageViewOpacity(+event.currentTarget.value / 10);

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
          <div className={styles.info_row}>
            <div className={styles.info_key}>Input image</div>
            <img
              className={styles.info_image}
              src={input_image}
              alt=""
              onPointerDown={() => setInputImageViewOpacity("switch")}
            />
            <input
              className={styles.slider}
              type="range"
              min="0"
              max="10"
              value={inputImageViewOpacity * 10}
              onChange={onSliderInput}
              title="Set brush width"
            ></input>
          </div>
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

const MSTP = ({
  result: { info, viewedImageIndex, inputImageViewOpacity },
}: StateType) => ({
  info,
  viewedImageIndex,
  inputImageViewOpacity,
});

const MDTP = { setViewedImageIndex, setInputImageViewOpacity };

export default connect(MSTP, MDTP)(ImageInfo);
