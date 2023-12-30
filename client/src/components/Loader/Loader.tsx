import { ClipLoader } from "react-spinners";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};
export const Loader = () => {
  return <ClipLoader color={"hsl(205, 100%, 40%)"} cssOverride={override} />;
};
