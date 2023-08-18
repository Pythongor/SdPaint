import { useLineBrush } from "./useLineBrush";
import { usePencilBrush } from "./usePencilBrush";
import { useEllipseBrush, useRectangleBrush } from "./usePrimitiveShapeBrush";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { UseBrushProps } from "../types";

export const useBrushes = (props: UseBrushProps) => {
  const brushType = useSelector(
    ({ brush: { brushType } }: StateType) => brushType
  );
  const pencilProps = usePencilBrush(props);
  const lineProps = useLineBrush(props);
  const rectangleProps = useRectangleBrush(props);
  const ellipseProps = useEllipseBrush(props);
  if (brushType === "pencil") {
    return pencilProps;
  } else if (brushType === "line") {
    return lineProps;
  } else if (brushType === "rectangle") {
    return rectangleProps;
  } else {
    return ellipseProps;
  }
};
