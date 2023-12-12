import { forwardRef } from "react";
import { Button } from "./ui/button";

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({children, toggleDialog}, ref) => {
  return (
    <dialog className="overflow-hidden border rounded-md shadow" ref={ref} onClick={(e) =>
    {
      if (e.currentTarget === e.target) toggleDialog();
    }}>
      <div className="flex flex-col gap-6 px-6 py-4">
        {children}
        <Button onClick={toggleDialog}>Close</Button>
      </div>
    </dialog>
  )
})

export default Dialog;