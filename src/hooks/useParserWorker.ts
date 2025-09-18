// Hook for using the SARIF parser worker
import { useCallback, useRef } from 'react';
import { useSarifStore } from '../stores/sarifStore';
import type { 
  ParseSarifMessage, 
  ParseProgressMessage, 
  ParseCompleteMessage, 
  ParseErrorMessage 
} from '../workers/sarif-parser.worker';

export interface UseParserWorkerResult {
  parseFile: (file: File) => Promise<void>;
  isLoading: boolean;
  progress: number;
  error: string | null;
}

export const useParserWorker = (): UseParserWorkerResult => {
  const workerRef = useRef<Worker | null>(null);
  const { setSarifData, setUIState, ui } = useSarifStore();
  
  const parseFile = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Terminate existing worker if any
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      
      // Create new worker
      workerRef.current = new Worker(
        new URL('../workers/sarif-parser.worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      // Set loading state
      setUIState({ 
        isLoading: true, 
        uploadProgress: 0, 
        error: null 
      });
      
      // Handle worker messages
      workerRef.current.onmessage = (event: MessageEvent) => {
        const message = event.data;
        
        switch (message.type) {
          case 'PARSE_PROGRESS': {
            const progressMsg = message as ParseProgressMessage;
            setUIState({ 
              uploadProgress: progressMsg.payload.progress 
            });
            break;
          }
          
          case 'PARSE_COMPLETE': {
            const completeMsg = message as ParseCompleteMessage;
            setSarifData(completeMsg.payload);
            setUIState({ 
              isLoading: false, 
              uploadProgress: 100,
              error: null 
            });
            
            // Clean up worker
            if (workerRef.current) {
              workerRef.current.terminate();
              workerRef.current = null;
            }
            
            resolve();
            break;
          }
          
          case 'PARSE_ERROR': {
            const errorMsg = message as ParseErrorMessage;
            setUIState({ 
              isLoading: false, 
              uploadProgress: 0,
              error: errorMsg.payload.error 
            });
            
            // Clean up worker
            if (workerRef.current) {
              workerRef.current.terminate();
              workerRef.current = null;
            }
            
            reject(new Error(errorMsg.payload.error));
            break;
          }
        }
      };
      
      // Handle worker errors
      workerRef.current.onerror = (error) => {
        const errorMessage = `Worker error: ${error.message || 'Unknown error'}`;
        setUIState({ 
          isLoading: false, 
          uploadProgress: 0,
          error: errorMessage 
        });
        
        // Clean up worker
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
        
        reject(new Error(errorMessage));
      };
      
      // Read file and send to worker
      const reader = new FileReader();
      reader.onload = () => {
        if (workerRef.current && reader.result) {
          const message: ParseSarifMessage = {
            type: 'PARSE_SARIF',
            payload: {
              fileContent: reader.result as string,
              fileName: file.name
            }
          };
          workerRef.current.postMessage(message);
        }
      };
      
      reader.onerror = () => {
        const errorMessage = `Failed to read file: ${file.name}`;
        setUIState({ 
          isLoading: false, 
          uploadProgress: 0,
          error: errorMessage 
        });
        reject(new Error(errorMessage));
      };
      
      reader.readAsText(file);
    });
  }, [setSarifData, setUIState]);
  
  // Return hook interface
  return {
    parseFile,
    isLoading: ui.isLoading,
    progress: ui.uploadProgress,
    error: ui.error,
  };
};

// Cleanup function for components that use the worker
export const useParserWorkerCleanup = () => {
  const workerRef = useRef<Worker | null>(null);
  
  return useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);
};
