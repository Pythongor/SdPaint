import React, { useState, useRef, useEffect, useCallback } from "react";
import { getRealBrushWidth } from "store/selectors";
import { setPaintImage } from "store/actions";
import { connect } from "react-redux";
import { StateType } from "store/types";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingCanvasProps = StateProps & DispatchProps;

export const PaintingCanvas: React.FC<PaintingCanvasProps> = ({
  isErasing,
  brushWidth,
  setPaintImage,
  paintImage,
}) => {
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const [previewContext, setPreviewContext] =
    useState<CanvasRenderingContext2D>();
  const paintingRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!paintingRef?.current || !context) return;
    const currentImage = paintingRef.current.toDataURL();
    if (paintImage === "") {
      context.clearRect(
        0,
        0,
        paintingRef.current.width,
        paintingRef.current.height
      );
    } else if (currentImage !== paintImage) {
      console.log("not same", currentImage, paintImage);
    }
  }, [paintImage, paintingRef?.current, context]);

  useEffect(() => {
    if (context) context.lineWidth = brushWidth;
    if (previewContext) previewContext.lineWidth = brushWidth;
  }, [brushWidth, previewContext, context]);

  useEffect(() => {
    if (!paintingRef?.current) return;
    const canvasContext = paintingRef?.current.getContext("2d");
    if (!canvasContext) return;
    setContext(canvasContext);
  }, [paintingRef?.current]);

  useEffect(() => {
    if (!context) return;
    context.lineJoin = "round";
  }, [context]);

  useEffect(() => {
    if (!previewRef?.current) return;
    const canvasContext = previewRef?.current.getContext("2d");
    if (!canvasContext) return;
    setPreviewContext(canvasContext);
  }, [previewRef?.current]);

  useEffect(() => {
    if (!previewContext) return;
    previewContext.lineJoin = "round";
  }, [previewContext]);

  const setMouseCoordinates = useCallback(
    (event) => {
      setMousePos({ x: event.clientX - pos.left, y: event.clientY - pos.top });
    },
    [pos, mousePos]
  );

  const resize = useCallback(() => {
    if (!paintingRef?.current) return;
    const { left, top } = paintingRef.current.getBoundingClientRect();
    setPos({ left, top });
  }, [paintingRef?.current]);

  useEffect(() => {
    resize();
  }, [paintingRef?.current]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
    };
  }, []);

  const mouseDown = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current) return;
      context.fillStyle = isErasing ? "white" : "black";
      setIsDrawing(true);
      context.beginPath();
      context.ellipse(
        mousePos.x,
        mousePos.y,
        context.lineWidth / 2,
        context.lineWidth / 2,
        0,
        0,
        2 * Math.PI
      );
      context.fill();
      context.beginPath();
      context.moveTo(mousePos.x, mousePos.y);
      setPaintImage(paintingRef.current.toDataURL());
    },
    [context, setMouseCoordinates, paintingRef?.current]
  );

  const mouseMove = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!previewContext || !previewRef?.current) return;
      previewContext.clearRect(
        0,
        0,
        previewRef?.current.width,
        previewRef?.current.height
      );
      previewContext.fillStyle = isErasing ? "white" : "black";
      if (isDrawing) {
        if (isErasing) {
          previewContext.strokeStyle = "#6b8aad";
        } else {
          previewContext.strokeStyle = "#d5e3c3";
        }
      } else {
        if (isErasing) {
          previewContext.strokeStyle = "black";
        } else {
          previewContext.strokeStyle = "white";
        }
      }
      previewContext.beginPath();
      previewContext.ellipse(
        mousePos.x,
        mousePos.y,
        previewContext.lineWidth / 2,
        previewContext.lineWidth / 2,
        0,
        0,
        2 * Math.PI
      );
      previewContext.stroke();
      previewContext.fill();

      if (isDrawing && context) {
        context.strokeStyle = isErasing ? "white" : "black";
        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
      }
    },
    [previewContext, previewRef?.current, setMouseCoordinates, context]
  );

  const mouseUp = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current) return;
      setIsDrawing(false);
      context.fillStyle = isErasing ? "white" : "black";
      context.beginPath();
      context.ellipse(
        mousePos.x,
        mousePos.y,
        context.lineWidth / 2,
        context.lineWidth / 2,
        0,
        0,
        2 * Math.PI
      );
      context.fill();
      // if (getSettings().fastMode) {
      //   generate();
      // }
      setPaintImage(paintingRef.current.toDataURL());
    },
    [context, setMouseCoordinates, paintingRef?.current]
  );

  const mouseOut = useCallback(() => {
    if (!previewRef?.current || !previewContext) return;
    previewContext.clearRect(
      0,
      0,
      previewRef?.current.width,
      previewRef?.current.height
    );
    setIsDrawing(false);
    if (!paintingRef.current) return;
    setPaintImage(paintingRef.current.toDataURL());
  }, [previewContext, previewRef?.current, paintingRef?.current]);

  return (
    <div className={styles.base}>
      <p className={styles.title}>Draw your sketch here</p>
      <canvas
        ref={paintingRef}
        className={cn(styles.canvas, styles.canvas__painting)}
        height="512"
        width="512"
      ></canvas>
      <canvas
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseOut={mouseOut}
        ref={previewRef}
        className={cn(styles.canvas, styles.canvas__preview)}
        height="512"
        width="512"
      ></canvas>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  isErasing: state.isErasing,
  brushWidth: getRealBrushWidth(state),
  paintImage: state.paintImage,
});

const MDTP = { setPaintImage };

export default connect(MSTP, MDTP)(PaintingCanvas);
