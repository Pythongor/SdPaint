import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getRealBrushWidth } from "store/selectors";
import { StateType } from "store/types";
import { CanvasInstructionProps, PointType } from "./types";

export const useCanvas = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const ref = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { brushWidth, brushType, withBrushFill } = useSelector(
    (state: StateType) => ({
      brushWidth: getRealBrushWidth(state),
      brushType: state.brush.brushType,
      withBrushFill: state.brush.withFill,
    })
  );

  const resize = useCallback(() => {
    if (!ref?.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    setPos({ left, top });
  }, [ref]);

  useEffect(() => {
    if (!context) return;
    if (brushType === "rectangle") {
      context.lineJoin = "miter";
    } else {
      context.lineJoin = "round";
    }
  }, [context, brushType]);

  useEffect(() => {
    if (context) {
      if (brushType !== "pencil" && withBrushFill) {
        context.lineWidth = 10;
      } else {
        context.lineWidth = brushWidth;
      }
    }
  }, [brushWidth, context, brushType, withBrushFill]);

  useEffect(() => {
    if (!ref?.current) return;
    const canvasContext = ref?.current.getContext("2d");
    if (!canvasContext) return;
    setContext(canvasContext);
  }, [ref]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
    };
  }, [resize]);

  const setMouseCoordinates = useCallback(
    (event) => {
      const newPos = {
        x: event.clientX - pos.left,
        y: event.clientY - pos.top,
      };
      setMousePos(newPos);
      return newPos;
    },
    [pos]
  );

  return { ref, context, mousePos, resize, setMouseCoordinates };
};

const ellipseArc = ({
  context,
  x,
  y,
  width,
  height,
}: CanvasInstructionProps) => {
  const w = width ?? context.lineWidth;
  const h = height ?? context.lineWidth;
  context.save();
  context.translate(x, y);
  if (w !== h) {
    if (w > h) {
      context.scale(Math.max(w, h) / Math.min(w, h), 1);
    } else {
      context.scale(1, Math.max(w, h) / Math.min(w, h));
    }
  }
  context.beginPath();
  context.arc(0, 0, Math.min(w, h), 0, 2 * Math.PI);
  context.restore();
  context.fill();
  context.stroke();
};

const dist = (point1: PointType, point2: PointType) =>
  Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);

export const drawEllipse = ({
  context,
  x,
  y,
  width,
  height,
  withStroke,
  withFill = true,
}: CanvasInstructionProps) => {
  context.beginPath();
  context.ellipse(
    x,
    y,
    width ?? context.lineWidth,
    height ?? context.lineWidth,
    0,
    0,
    2 * Math.PI
  );
  withStroke && context.stroke();
  withFill && context.fill();
  context.beginPath();
};

export const drawRectangle = ({
  context,
  x,
  y,
  width,
  height,
  withStroke,
  withFill = true,
}: CanvasInstructionProps) => {
  context.rect(x, y, width ?? context.lineWidth, height ?? context.lineWidth);
  withStroke && context.stroke();
  withFill && context.fill();
  context.beginPath();
};

export const drawLine = (
  context: CanvasRenderingContext2D,
  point1: PointType,
  point2: PointType
) => {
  context.beginPath();
  context.moveTo(point1.x, point1.y);
  context.lineTo(point2.x, point2.y);
  context.stroke();
};

export const clearRectangle = ({
  context,
  x,
  y,
  width,
  height,
}: CanvasInstructionProps) => {
  context.clearRect(
    x,
    y,
    width ?? context.lineWidth,
    height ?? context.lineWidth
  );
  context.beginPath();
};

export const clearEllipse = ({
  context,
  x,
  y,
  width,
  height,
}: CanvasInstructionProps) => {
  context.globalCompositeOperation = "destination-out";
  ellipseArc({
    context,
    x,
    y,
    width,
    height,
  });
  context.globalCompositeOperation = "source-over";
  context.beginPath();
};

export const clearSquaredLine = (
  context: CanvasRenderingContext2D,
  point1: PointType,
  point2: PointType
) => {
  let pnt1 = point1,
    pnt2 = point2;

  if (point2.x < point1.x) {
    pnt1 = point2;
    pnt2 = point1;
  }

  const length = dist(pnt1, pnt2);

  context.save();
  context.translate(pnt1.x, pnt1.y);
  context.rotate(Math.atan2(pnt2.y - pnt1.y, pnt2.x - pnt1.x));
  context.clearRect(0, -context.lineWidth / 2, length, context.lineWidth);
  context.restore();
};

export const getRectangleFrom2Points = (
  point1: PointType,
  point2: PointType
) => {
  const [minX, maxX] = [point1.x, point2.x].sort();
  const [minY, maxY] = [point1.y, point2.y].sort();
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

export const getEllipseFrom2Points = (point1: PointType, point2: PointType) => {
  const x = (point1.x + point2.x) / 2;
  const y = (point1.y + point2.y) / 2;
  const width = Math.abs(point1.x - point2.x) / 2;
  const height = Math.abs(point1.y - point2.y) / 2;
  return { x, y, width, height };
};

export const clear = (
  ref: React.RefObject<HTMLCanvasElement>,
  context?: CanvasRenderingContext2D
) => {
  if (!ref.current || !context) return;
  context.clearRect(0, 0, ref?.current.width, ref?.current.height);
};
