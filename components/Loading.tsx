import React from "react";

type Props = {
  message: string;
};

const Loading = (props: Props) => {
  return (
    <>
      <div className="relative inset-0 flex flex-col items-center justify-center z-50 gap-2 mt-10 pt-10 md:mt-16">
        <div className="animate-spin rounded-full w-10 border-t-4 border-b-4 border-gray-200 h-10"></div>
        <p className="text-sm text-bold animate-pulse">{props.message}</p>
      </div>
    </>
  );
};

export default Loading;
