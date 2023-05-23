import React, { useRef, useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setImageViewerActive } from "store/actions";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultCanvas: React.FC<ResultCanvasProps> = ({
  cnProgress,
  setImageViewerActive,
  resultImage,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!ref?.current) return;
    const canvasContext = ref?.current.getContext("2d");
    if (!canvasContext) return;
    setContext(canvasContext);
  }, [ref?.current]);

  useEffect(() => {
    if (!context) return;
    if (resultImage === "") {
      context.clearRect(0, 0, 512, 512);
    } else {
      fetch(resultImage)
        .then((response) => response.blob())
        .then((blob) => createImageBitmap(blob))
        .then((imageBitMap) => context.drawImage(imageBitMap, 0, 0, 512, 512));
    }
  }, [resultImage, context]);

  const onClick = useCallback(() => {
    if (!ref.current || !resultImage) return;
    setImageViewerActive(true);
  }, [ref.current, resultImage]);

  const canvasClass =
    (resultImage ? "" : "empty") + (cnProgress !== 0 ? " progress" : "");

  return (
    <div className="canvas_base">
      <div className="canvas_wrapper">
        <p className="canvas_header">Your result here</p>
        <canvas
          className={canvasClass}
          id="result"
          height="512"
          width="512"
          onClick={onClick}
          ref={ref}
        ></canvas>
        {cnProgress !== 0 && (
          <>
            <div className="loader"></div>
            <progress id="cnProgress" max="100" value={cnProgress}>
              {cnProgress}
            </progress>
          </>
        )}
      </div>
    </div>
  );
};

const MSTP = ({ cnProgress, resultImage }: StateType) => ({
  cnProgress,
  resultImage,
});

const MDTP = { setImageViewerActive };

export default connect(MSTP, MDTP)(ResultCanvas);
