import React, { useEffect } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import {
  setViewedImageIndex,
  setInputImageViewOpacity,
  setTilingViewMode,
} from "store/actions";
import cn from "classnames";
import styles from "./ImagesViewer.module.scss";
import { Arrow } from "components/widgets";

type OwnProps = {
  isHidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
};
type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps & OwnProps;

const ImageInfo: React.FC<ImageViewerProps> = ({
  isHidden,
  setHidden,
  info,
  withTiling,
  viewedImageIndex,
  inputImageOpacity,
  setInputImageViewOpacity,
  setTilingViewMode,
}) => {
  useEffect(
    () => () => {
      setInputImageViewOpacity(0);
      setTilingViewMode(false);
    },
    [setInputImageViewOpacity, setTilingViewMode]
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
    with_tiling,
    // infotexts,
  } = info;

  const infoRows: [string, string, string][] = [
    [
      "Seed",
      `${all_seeds[viewedImageIndex]}`,
      "Having parameters, seed and your sketch unchanged means having the same result",
    ],
    ["Prompt", all_prompts[viewedImageIndex], "Describe the desired result"],
    [
      "Negative prompt",
      all_negative_prompts[viewedImageIndex],
      "Describe the undesired result",
    ],
    ["Size", `${width} x ${height}`, "Size of image in pixels"],
    ["Sampler", sampler_name, "Sampling method used during generation process"],
    [
      "CFG scale",
      `${cfg_scale}`,
      "The higher the value, the more accurate may be the result",
    ],
    [
      "Steps",
      `${steps}`,
      "The higher the value, the better the result, but the more waiting time",
    ],
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
            <div
              className={styles.info_key}
              title="The sketch that served as the basis for the generation"
            >
              Input image
            </div>
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
              value={inputImageOpacity * 10}
              onChange={onSliderInput}
              title="Set brush width"
            ></input>
          </div>
          {with_tiling && (
            <div className={styles.info_row}>
              <label className={styles.info_value}>
                Tile view
                <input
                  type="checkbox"
                  className={styles.info_checkbox}
                  checked={withTiling}
                  onChange={(event) => {
                    setTilingViewMode(event.currentTarget.checked);
                    console.log(withTiling);
                  }}
                />
              </label>
            </div>
          )}
          {infoRows.map(([key, value, title]) => (
            <div className={styles.info_row} key={key}>
              <div className={styles.info_key} title={title}>
                {key}
              </div>
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
  result: { info },
  viewer: { viewedImageIndex, inputImageOpacity, withTiling },
}: StateType) => ({
  info,
  viewedImageIndex,
  inputImageOpacity,
  withTiling,
});

const MDTP = {
  setViewedImageIndex,
  setInputImageViewOpacity,
  setTilingViewMode,
};

export default connect(MSTP, MDTP)(ImageInfo);
