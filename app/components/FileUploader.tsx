import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
    inputId?: string; // Add this prop
}

const FileUploader = ({ onFileSelect, inputId }: FileUploaderProps) => {
    const [localFile, setLocalFile] = useState<File | null>(null); // Add local state
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setLocalFile(file); // Update local state
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    });

    const handleRemove = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalFile(null); // Clear local state
        onFileSelect?.(null);
    }, [onFileSelect]);




    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()}
                       id={inputId} // Add this line
                />

                <div className="space-y-4 cursor-pointer">
                    {localFile ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {localFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(localFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button type="button" className="p-2 cursor-pointer" onClick={handleRemove}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader