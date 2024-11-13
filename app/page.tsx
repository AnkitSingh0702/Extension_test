"use client";
import { PiMagicWandFill } from "react-icons/pi";
import { useState, useRef, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '../components/ui/alert-dialog';
import { Button } from '../components/ui/button';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const dialogRef = useRef<HTMLDivElement | null>(null); // Set dialogRef type

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setInput('');
    setGeneratedResponse('');
  };

  const handleGenerate = () => {
    const response = `Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.`;
    setGeneratedResponse(response);
  };

  const handleInsert = () => {
    chrome.runtime.sendMessage({ action: "insertText", text: generatedResponse }, (response) => {
      if (response && response.status === "success") {
        console.log("Text inserted successfully!");
      } else {
        console.error("Failed to insert text:", response?.message);
      }
    });
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        {!isOpen && (
          <div
            className="bg-slate-300 p-3 rounded-full cursor-pointer"
            onClick={handleOpen}
          >
            <PiMagicWandFill color="#1565C0" size={30} />
          </div>
        )}

        {isOpen && (
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent ref={dialogRef} className="p-6 w-96 bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle></AlertDialogTitle>
                <AlertDialogDescription>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:outline-none"
                  placeholder="Type your command here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={handleGenerate} className="w-full mt-2">
                  Generate
                </Button>
              </div>

              {generatedResponse && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-500">Command:</p>
                  <p className="text-base font-semibold mb-2">{input}</p>
                  <p className="text-sm text-gray-500">Response:</p>
                  <p className="text-base">{generatedResponse}</p>
                  
                  <Button onClick={handleInsert} className="w-full mt-2">
                    Insert
                  </Button>
                </div>
              )}

              <AlertDialogFooter>
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
